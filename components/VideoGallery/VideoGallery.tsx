import VideoCard from "@/components/VideoCard/VideoCard";
import styles from "./VideoGallery.module.css";

export default function VideoGallery({
  ids,
  title = "Patient video",
}: {
  ids: string[];
  title?: string;
}) {
  return (
    <div className={styles.grid}>
      {ids.map((id) => (
        <VideoCard key={id} id={id} title={title} />
      ))}
    </div>
  );
}
