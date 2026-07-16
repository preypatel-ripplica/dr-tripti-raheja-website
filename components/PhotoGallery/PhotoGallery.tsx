"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Close, ArrowRight } from "@/components/Icons";
import styles from "./PhotoGallery.module.css";

export default function PhotoGallery({
  images,
  basePath = "/images/",
}: {
  images: string[];
  basePath?: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const show = useCallback(
    (dir: number) =>
      setActive((cur) => {
        if (cur === null) return cur;
        return (cur + dir + images.length) % images.length;
      }),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(1);
      if (e.key === "ArrowLeft") show(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, show]);

  return (
    <>
      <div className={styles.grid}>
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            className={styles.item}
            onClick={() => setActive(i)}
            aria-label={`Open image ${i + 1}`}
          >
            <Image
              src={`${basePath}${img}`}
              alt={`Gallery image ${i + 1}`}
              fill
              sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
              className={styles.thumb}
            />
            <span className={styles.overlay}>
              <span className={styles.zoom}>+</span>
            </span>
          </button>
        ))}
      </div>

      {active !== null && (
        <div className={styles.lightbox} onClick={close} role="dialog" aria-modal="true">
          <button type="button" className={styles.close} onClick={close} aria-label="Close">
            <Close width={28} height={28} />
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.prev}`}
            onClick={(e) => {
              e.stopPropagation();
              show(-1);
            }}
            aria-label="Previous"
          >
            <ArrowRight width={26} height={26} style={{ transform: "rotate(180deg)" }} />
          </button>
          <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
            <Image
              src={`${basePath}${images[active]}`}
              alt={`Gallery image ${active + 1}`}
              width={1100}
              height={800}
              className={styles.full}
            />
          </div>
          <button
            type="button"
            className={`${styles.nav} ${styles.next}`}
            onClick={(e) => {
              e.stopPropagation();
              show(1);
            }}
            aria-label="Next"
          >
            <ArrowRight width={26} height={26} />
          </button>
        </div>
      )}
    </>
  );
}
