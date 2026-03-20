# AURA Demo Page Setup Guide

This demo page is designed for anonymous research submissions. To populate the page with your actual experimental results, follow the instructions below.

## 1. Hosting Your Assets

You need to host your audio files and spectrogram images on a public server.
- **Audio:** `.wav` or `.mp3` files.
- **Images:** `.png` or `.jpg` spectrograms.

*Note: Ensure your hosting service does not reveal your identity for double-blind reviews.*

## 2. Updating Audio Samples

Open `src/App.tsx` and locate the following constants:

### Main Audio Comparisons (`MAIN_DEMOS`)
This array contains the samples for the main comparison section. Each object in the array represents one text prompt and its corresponding results across different models.

```typescript
{
  id: 'm1',
  prompt: "Your text prompt here...",
  rows: [
    { 
      modelName: 'AudioLDM', 
      base: 'URL_TO_BASE_AUDIO', 
      vanillaRAG: 'URL_TO_RAG_AUDIO', 
      aura: 'URL_TO_AURA_AUDIO', 
      target: 'URL_TO_TARGET_AUDIO' 
    },
    // ... repeat for other backbones
  ]
}
```

### Ablation Study (`ABLATION_DEMOS`)
This array contains samples for the ablation study. Each object represents one prompt and its variants.

```typescript
{
  id: 'a1',
  prompt: "Your ablation prompt here...",
  variants: [
    { name: 'Target', url: 'URL_TO_TARGET' },
    { name: 'Base (MusicGen)', url: 'URL_TO_BASE' },
    { name: '+ MAP (Track) + ASA', url: 'URL_TO_VARIANT_1' },
    { name: '+ IAD', url: 'URL_TO_VARIANT_2' },
    { name: '+ MAP (Chunk)', url: 'URL_TO_VARIANT_3' },
    { name: 'AURA-Full (Ours)', url: 'URL_TO_AURA' },
  ]
}
```

## 3. Updating Spectrograms

In `src/App.tsx`, look for the "Spectrogram Visualization" section (around line 400). Replace the placeholders with your actual image URLs:

```tsx
<img 
  src="URL_TO_SPECTROGRAM_IMAGE" 
  alt="Description" 
  referrerPolicy="no-referrer" 
  className="w-full h-full object-cover"
/>
```

## 4. System Architecture Diagram

Replace the "Architecture Diagram Placeholder" in the Methodology section with your actual system diagram image.

## 5. Quantitative Results

Update the values in the `Quantitative Results` table (around line 370) to match the data in your paper's Table 2.
