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
          <details
            key={item.q}
            className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
            open={isOpen}
          >
            <summary
              className={styles.q}
              onClick={(event) => {
                event.preventDefault();
                setOpen(isOpen ? null : i);
              }}
            >
              <span>{item.q}</span>
              <Chevron
                width={20}
                height={20}
                className={styles.icon}
                style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
              />
            </summary>
            <div className={styles.answer} style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
              <div className={styles.answerInner}>
                <p>{item.a}</p>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
