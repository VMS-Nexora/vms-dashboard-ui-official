import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';

interface IDCardData {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  placeOfOrigin?: string;
  placeOfResidence?: string;
}

const parseIDCardText = (text: string): IDCardData => {
  const data: IDCardData = {};

  // Normalize text: remove extra spaces, newlines, and weird characters
  const normalized = text.replace(/\s+/g, ' ').trim();

  // Regular expressions based on observed patterns. You might need to adjust these.
  const nameMatch = normalized.match(/Full name: -?\s*([^-]+)/i);
  if (nameMatch) {
    data.fullName = nameMatch[1].trim();
  }

  const dobMatch = normalized.match(/Date of birth:\s*~?\s*([\d/]+)/i);
  if (dobMatch) {
    data.dateOfBirth = dobMatch[1].trim();
  }

  const genderMatch = normalized.match(/Sex\s*([A-Za-z]+)/i);
  if (genderMatch) {
    data.gender = genderMatch[1].trim();
  }

  const nationalityMatch = normalized.match(
    /National(?:ity|ity\.)\s*[\\/iét]*\s*([A-Za-zÀ-ỹ]+)/i
  );
  if (nationalityMatch) {
    data.nationality = nationalityMatch[1].trim();
  }

  const originMatch = normalized.match(/Place of origin:\s*([^-]+)/i);
  if (originMatch) {
    data.placeOfOrigin = originMatch[1].trim();
  }

  const residenceMatch = normalized.match(/Place of residence:\s*([^-]+)/i);
  if (residenceMatch) {
    data.placeOfResidence = residenceMatch[1].trim();
  }

  return data;
};

const CameraScanner = () => {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [idData, setIdData] = useState<IDCardData | null>(null);
  const [processing, setProcessing] = useState(false);

  // Capture image from webcam
  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImage(imageSrc);
        processImage(imageSrc);
      }
    }
  };

  // Handle file upload
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageSrc = reader.result as string;
        setImage(imageSrc);
        processImage(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  // Process image with OCR and then parse the text
  const processImage = async (imageSrc: string) => {
    setProcessing(true);
    setRawText('');
    setIdData(null);

    try {
      const { data } = await Tesseract.recognize(imageSrc, 'eng');
      const extractedText = data.text;
      setRawText(extractedText);

      // Parse the text to extract structured data
      const parsedData = parseIDCardText(extractedText);
      setIdData(parsedData);
    } catch (error) {
      console.error('OCR error:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl mb-4">Vietnamese ID Card Scanner</h2>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/png"
        className="mb-4"
      />
      <button
        onClick={capture}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Scan ID with Camera
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-4"
      />

      {image && (
        <div>
          <img
            src={image}
            alt="Scanned ID"
            className="mt-4 w-64"
          />
        </div>
      )}

      {processing && <p>Processing image...</p>}

      {rawText && (
        <div className="mt-4 p-2 bg-gray-200 rounded w-80">
          <strong>Raw Extracted Text:</strong>
          <p className="text-xs whitespace-pre-wrap">{rawText}</p>
        </div>
      )}

      {idData && (
        <div className="mt-4 p-4 bg-green-100 rounded w-80">
          <h3 className="font-bold mb-2">Parsed ID Information:</h3>
          {idData.fullName && (
            <p>
              <strong>Full Name:</strong> {idData.fullName}
            </p>
          )}
          {idData.dateOfBirth && (
            <p>
              <strong>Date of Birth:</strong> {idData.dateOfBirth}
            </p>
          )}
          {idData.gender && (
            <p>
              <strong>Gender:</strong> {idData.gender}
            </p>
          )}
          {idData.nationality && (
            <p>
              <strong>Nationality:</strong> {idData.nationality}
            </p>
          )}
          {idData.placeOfOrigin && (
            <p>
              <strong>Place of Origin:</strong> {idData.placeOfOrigin}
            </p>
          )}
          {idData.placeOfResidence && (
            <p>
              <strong>Place of Residence:</strong> {idData.placeOfResidence}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraScanner;
