import { useEffect, useState } from "react";

export default function ImgFetched({
  photo_url,
  token,
}: { photo_url: string; token: string }) {
  const [img, setImg] = useState<string | null>(null);

  useEffect(() => {
    const fetchImg = async () => {
      const response = await fetch(`${photo_url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = await response.blob();
      setImg(URL.createObjectURL(blob));
    };

    fetchImg();
  }, [photo_url, token]);
  return <>{img && <img src={img} alt="img" className="contact-photo" />}</>;
}
