"use client";
import React, { useState } from 'react';

const ClassifyPage: React.FC = () => {
  const [classification, setClassification] = useState<string | null>(null);
  const [carbEstimation, setCarbEstimation] = useState<number | null>(null);
  const [insulin, setInsulin] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentSugar, setCurrentSugar] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const imageFile = event.target.files[0];
    setImage(imageFile);

    // Create a URL for the image file to use in an img element
    const url = URL.createObjectURL(imageFile);
    setPreviewImage(url);
  };

  const handleSubmit = async () => {
    if (!image) {
      return;
    }

    setLoading(true);
    const imageData = new FormData();
    imageData.append('file', image);
    imageData.append('current_sugar', currentSugar);
    imageData.append('weight', weight);

    try {
      const response = await fetch('https://count-crab-uu4qhhj35a-as.a.run.app/classify', {
        method: 'POST',
        body: imageData,
      });

      if (!response.ok) {
        throw new Error('Image classification failed');
      }

      const result = await response.json();
      setClassification(result.food_name);
      setCarbEstimation(result.carb_estimation);
      setInsulin(result.insulin);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = !currentSugar || !weight || !image;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <img src="/logo.png" alt="Logo" className="block mx-auto h-38 mb-4" />
          {/* <h1 className="text-2xl font-bold mb-4">CountCrab</h1> */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Sugar:</label>
              <input type="number" value={currentSugar} onChange={e => setCurrentSugar(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Weight:</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-cyan-400 hover:bg-cyan-200 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 019.07 4h5.86a2 2 0 011.664.89l.812 1.22a2 2 0 001.664.89H19a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="ml-2">Upload Image</span>
              </label>
              <input id="file-upload" type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
            </div>
            {previewImage && <img src={previewImage} alt="Preview" className="mt-4 h-64 object-contain" />}
            <button onClick={handleSubmit} disabled={isSubmitDisabled} className={`mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitDisabled ? 'bg-gray-300' : 'bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'}`}>Submit</button>
          </div>
          {loading && <p className="mt-4 text-sm text-gray-500">Loading...</p>}
          {classification && <p className="mt-4 text-sm text-gray-500">Classification: {classification}</p>}
          {carbEstimation !== null && (
            carbEstimation > 0
              ? <p className="mt-4 text-sm text-gray-500">Carb Estimation: {carbEstimation}g</p>
              : <p className="mt-4 text-sm text-gray-500">This food doesn&apos;t have carbs in the system.</p>
          )}
          {insulin !== null && carbEstimation !== null && carbEstimation > 0 && <p className="mt-4 text-sm text-gray-500">Insulin: {insulin} units</p>}
        </div>
      </div>
    </div>
  );
};

export default ClassifyPage;
