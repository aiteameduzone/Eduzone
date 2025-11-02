import React, { useState, useCallback, useMemo } from 'react';
import type { ArtStyle } from './types';
import { generatePharaonicImage } from './services/geminiService';
import { AnkhIcon, WandIcon, UploadIcon } from './components/icons';

const ART_STYLES: ArtStyle[] = [
  {
    id: 'pharaoh',
    name: 'Sun King Pharaoh',
    description: 'Majestic, with golden regalia and cinematic lighting.',
    prompt: 'a photorealistic, cinematic portrait of a Pharaoh. The person should be adorned with a golden Nemes headdress, an ornate Usekh collar with lapis lazuli and carnelian, and rich linen robes. They should be holding a golden crook and flail. The background should be a grand, sunlit temple hall with towering pillars, in the style of a modern high-resolution photograph.',
  },
  {
    id: 'queen',
    name: 'Majestic Queen',
    description: 'Regal and divine, ruler of the Two Lands.',
    prompt: 'a photorealistic, majestic portrait of a ruling Queen of Egypt. The person is adorned with an elaborate tripartite wig, a vulture headdress of Nekhbet, and a stunning Usekh collar. Her gown is of the finest, semi-translucent pleated linen. The background is her throne room, decorated with lotus motifs and gold leaf, illuminated by grand windows. The style should be powerful, elegant, and worthy of a divine ruler.',
  },
  {
    id: 'vizier',
    name: 'Royal Vizier',
    description: 'Wise and powerful, adorned in courtly finery.',
    prompt: 'a photorealistic portrait of a powerful Royal Vizier of Ancient Egypt. The person wears elegant pleated linen garments, a significant gold necklace, and bracelets. They might be holding a papyrus scroll. The background is an opulent palace chamber with intricate carvings and decorations. The lighting is soft and dignified, like a formal court portrait.',
  },
  {
    id: 'priest',
    name: 'Temple High Priest',
    description: 'Mystical and serene, in sacred temple attire.',
    prompt: 'a photorealistic, atmospheric portrait of an Ancient Egyptian High Priest. The person is dressed in clean white linen robes, with an ornate pectoral necklace and leopard skin stole. The setting is the inner sanctum of a temple, dimly lit by torches, with detailed hieroglyphs on the stone walls behind them. The style should be realistic and evocative.',
  },
  {
    id: 'guardian',
    name: 'Guardian of the Nile',
    description: 'Strong and stoic, protector of the ancient lands.',
    prompt: 'a photorealistic, dramatic portrait of a Guardian of the Nile. The person is styled as an elite Medjay warrior or a noble protector, wearing ornate leather and bronze armor over linen. They hold a decorated spear or khopesh. The background is a view of the Nile river at dusk with pyramids in the distance. The style should be powerful and epic.',
  },
  {
    id: 'scribe',
    name: 'Royal Scribe',
    description: 'Keeper of knowledge, documenting history.',
    prompt: 'a photorealistic, highly-detailed portrait of a Royal Scribe. The person is seated cross-legged on a mat, holding a palette and reed brush, with a papyrus scroll open before them. They are dressed in a simple, practical linen kilt. The setting is a library or archive, with shelves of scrolls in the background. The lighting is focused and natural, as if from a nearby window, highlighting their intellectual pursuit.',
  },
  {
    id: 'charioteer',
    name: 'Elite Charioteer',
    description: 'A swift and heroic warrior of the Pharaoh\'s army.',
    prompt: 'a photorealistic, action-oriented portrait of an Elite Egyptian Charioteer. The person is depicted in a decorated chariot, wearing scale armor and holding a composite bow. Their expression is focused and determined. The background shows the vast desert with the sun low in the sky, creating long shadows and a dramatic, epic atmosphere. The image should convey speed and martial prowess.',
  },
    {
    id: 'goddess',
    name: 'Divine Incarnation',
    description: 'Ethereal beauty, touched by the gods.',
    prompt: 'a photorealistic, ethereal portrait of a person as a divine incarnation, reminiscent of a god or goddess like Isis or Horus. They wear a simple, elegant white linen dress and subtle but significant golden jewelry, perhaps with a single divine symbol like the Eye of Horus. An otherworldly glow surrounds them, with a background of a starlit temple night sky. The style should be mystical, serene, and beautiful.',
  },
];

const Header: React.FC = () => (
  <header className="text-center p-4 md:p-6 border-b-2 border-yellow-700/50">
    <div className="flex items-center justify-center gap-4">
        <AnkhIcon className="w-10 h-10 text-yellow-400" />
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 tracking-wider">
        Pharaoh Fy Me
        </h1>
        <AnkhIcon className="w-10 h-10 text-yellow-400" />
    </div>
    <p className="text-yellow-200 mt-2 text-lg">
      Celebrate the Grand Egyptian Museum opening by turning your portrait into an ancient masterpiece.
    </p>
  </header>
);

const ImageUploader: React.FC<{ onImageSelect: (file: File) => void; previewUrl: string | null }> = ({ onImageSelect, previewUrl }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageSelect(e.dataTransfer.files[0]);
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className="w-full">
            <label 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
                    ${previewUrl ? 'border-yellow-500' : 'border-yellow-700/50 hover:border-yellow-500 bg-yellow-900/20'}`}
            >
                {previewUrl ? (
                    <img src={previewUrl} alt="Image preview" className="object-cover w-full h-full rounded-lg" />
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-yellow-300">
                        <UploadIcon className="w-10 h-10 mb-3" />
                        <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs">PNG, JPG, or WEBP</p>
                    </div>
                )}
                <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </label>
        </div>
    );
};

const StyleSelector: React.FC<{ selectedStyleId: string | null; onSelect: (id: string) => void }> = ({ selectedStyleId, onSelect }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
    {ART_STYLES.map((style) => (
      <button
        key={style.id}
        onClick={() => onSelect(style.id)}
        className={`p-4 border-2 rounded-lg text-left transition-all duration-300 transform hover:-translate-y-1
          ${selectedStyleId === style.id 
            ? 'bg-yellow-500 border-yellow-300 text-gray-900 shadow-lg shadow-yellow-500/30' 
            : 'bg-yellow-800/40 border-yellow-700/50 text-yellow-200 hover:border-yellow-500'}`}
      >
        <p className="font-bold text-md">{style.name}</p>
        <p className="text-xs mt-1">{style.description}</p>
      </button>
    ))}
  </div>
);

const ResultDisplay: React.FC<{ isLoading: boolean; generatedImageUrl: string | null; error: string | null }> = ({ isLoading, generatedImageUrl, error }) => (
  <div className="w-full aspect-square bg-black/50 rounded-lg flex items-center justify-center p-4 border-2 border-yellow-700/50 relative overflow-hidden">
    {isLoading && (
      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
        <div className="w-16 h-16 border-4 border-t-yellow-400 border-yellow-700/50 rounded-full animate-spin"></div>
        <p className="text-yellow-200 mt-4 text-lg">Creating your masterpiece...</p>
      </div>
    )}
    {error && <p className="text-red-400 text-center">{error}</p>}
    {!isLoading && !error && generatedImageUrl && (
      <img src={generatedImageUrl} alt="Generated Pharaonic art" className="object-contain w-full h-full rounded-md" />
    )}
    {!isLoading && !error && !generatedImageUrl && (
      <div className="text-center text-yellow-300/80">
        <AnkhIcon className="w-16 h-16 mx-auto opacity-30" />
        <p className="mt-4">Your creation will appear here</p>
      </div>
    )}
  </div>
);


export default function App() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!uploadedImage) return null;
    return URL.createObjectURL(uploadedImage);
  }, [uploadedImage]);

  const handleImageSelect = useCallback((file: File) => {
    setUploadedImage(file);
    setGeneratedImageUrl(null);
    setError(null);
  }, []);

  const handleGenerateClick = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first.');
      return;
    }
    if (!selectedStyleId) {
      setError('Please select an art style.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const style = ART_STYLES.find(s => s.id === selectedStyleId);
      if (!style) throw new Error('Invalid style selected.');
      
      const resultUrl = await generatePharaonicImage(uploadedImage, style.prompt);
      setGeneratedImageUrl(resultUrl);
    } catch (err: any) {
        console.error(err);
        const errorMessage = err.message.includes("refused") 
            ? "The model couldn't process this image. Please try a different one."
            : "An error occurred during image generation. Please try again.";
        setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isButtonDisabled = !uploadedImage || !selectedStyleId || isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-yellow-900/50 to-gray-900 text-white font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-yellow-300">1. Upload Your Portrait</h2>
              <ImageUploader onImageSelect={handleImageSelect} previewUrl={previewUrl} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-yellow-300">2. Choose an Ancient Style</h2>
              <StyleSelector selectedStyleId={selectedStyleId} onSelect={setSelectedStyleId} />
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="flex flex-col gap-6">
             <h2 className="text-2xl font-semibold text-yellow-300">3. Behold Your Masterpiece</h2>
             <ResultDisplay isLoading={isLoading} generatedImageUrl={generatedImageUrl} error={error} />
          </div>
        </div>

         {/* Generate Button */}
        <div className="mt-8 text-center">
            {/* FIX: Corrected the malformed disabled and className attributes on the button. */}
            <button
              onClick={handleGenerateClick}
              disabled={isButtonDisabled}
              className={`inline-flex items-center justify-center gap-2 px-8 py-3 font-bold text-lg rounded-full border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                isButtonDisabled
                  ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-amber-500 border-yellow-300 text-gray-900 hover:shadow-lg hover:shadow-yellow-500/40'
              }`}
            >
              <WandIcon className="w-6 h-6" />
              <span>{isLoading ? 'Transforming...' : 'Pharaoh Fy Me!'}</span>
            </button>
            {error && !isLoading && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-yellow-500/70 text-sm border-t-2 border-yellow-700/50">
        <p>Powered by Gemini. Inspired by the legacy of Ancient Egypt.</p>
      </footer>
    </div>
  );
}
