import { useEffect, useRef, useState } from 'react';
import { Camera, ImagePlus, Loader2 } from 'lucide-react';
import { scanMedicineImage } from '@/services/aiService';

export function ScanPanel({ medicines, onProposal }) {
  const [previewUrl, setPreviewUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const cameraRef = useRef(null);
  const uploadRef = useRef(null);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setError('');
    setIsScanning(true);
    try {
      const result = await scanMedicineImage(file, medicines);
      const medicine = medicines.find((m) => m.id === result.medicineId);
      if (!medicine) throw new Error('Could not recognise this medicine. Try a clearer photo.');
      onProposal({
        intent: 'consume',
        medicine,
        quantity: result.quantity ?? 1,
        source: 'IMAGE',
        heard: 'Image scan',
        isDemo: result.isDemo,
        confidence: result.confidence,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
        {previewUrl ? (
          <img src={previewUrl} alt="Medicine preview" className="h-full w-full object-cover" />
        ) : (
          <p className="px-6 text-center text-sm text-slate-400">
            Take a photo of the tablet strip or bottle, or upload one
          </p>
        )}
        {isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/60 text-white">
            <Loader2 size={28} className="animate-spin" />
            <span className="text-sm">Analysing with AI…</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => cameraRef.current?.click()}
          disabled={isScanning}
          className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          <Camera size={18} /> Take photo
        </button>
        <button
          onClick={() => uploadRef.current?.click()}
          disabled={isScanning}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <ImagePlus size={18} /> Upload
        </button>
      </div>

      <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={handleFile} />
      <input ref={uploadRef} type="file" accept="image/*" hidden onChange={handleFile} />

      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </div>
  );
}