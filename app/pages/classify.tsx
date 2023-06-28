"use client";
import React, { useState } from 'react';

const ClassifyPage: React.FC = () => {
  const [classification, setClassification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    setLoading(true);
    const imageFile = event.target.files[0];
    const imageData = new FormData();
    imageData.append('image', imageFile);

    try {
      const response = await fetch('https://your-api-url.com', {
        method: 'POST',
        body: imageData,
      });

      if (!response.ok) {
        throw new Error('Image classification failed');
      }

      const result = await response.json();
      setClassification(result.classification);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Image Classification</h1>
      <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} />
      {loading && <p>Loading...</p>}
      {classification && <p>Classification: {classification}</p>}
    </div>
  );
};

export default ClassifyPage;
