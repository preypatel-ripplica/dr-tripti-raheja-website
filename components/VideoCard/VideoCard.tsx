"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "@/components/Icons";
import styles from "./VideoCard.module.css";

/**
 * Lightweight YouTube embed: shows the thumbnail poster and only loads the
 * iframe after the user clicks play (keeps the page fast, no autoplay tracking).
 */
export default function VideoCard({
  id,
  title = "Patient video",
}: {
  id: string;
  title?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={styles.card}>
      {playing ? (
        <iframe
          className={styles.frame}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerated-download; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className={styles.poster}
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
        >
          <Image
            src={`/images/yt/${id}.jpg`}
            alt={title}
            fill
            sizes="(max-width: 700px) 100vw, 33vw"
            className={styles.thumb}
          />
          <span className={styles.playBtn}>
            <Play width={26} height={26} />
          </span>
        </button>
      )}
    </div>
  );
}
