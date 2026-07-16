"use client";

import { useState } from "react";
import { Chevron } from "@/components/Icons";
import type { Faq as FaqItem } from "@/lib/content";
import styles from "./Faq.module.css";

export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={styles.list}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
            <button
              type="button"
              className={styles.q}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{item.q}</span>
              <Chevron
                width={20}
                height={20}
                className={styles.icon}
                style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
              />
            </button>
            <div className={styles.answer} style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
              <div className={styles.answerInner}>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
