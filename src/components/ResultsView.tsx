import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  CheckCircle,
  Download,
  Share2,
  Twitter,
  Instagram,
  Video,
  MessageCircle,
} from 'lucide-react';
import { ResultsViewProps } from '../types';
import { useQuizTranslation } from '../hooks/useQuizTranslation';

// Lazy import to avoid bundling cost until needed
async function rasterizeToPng(
  node: HTMLElement,
  width: number,
  height: number,
  pixelRatio = 2
): Promise<Blob> {
  const { toPng } = await import('html-to-image');
  const dataUrl = await toPng(node, {
    width,
    height,
    pixelRatio,
    style: {
      width: `${width}px`,
      height: `${height}px`,
    },
  });
  const res = await fetch(dataUrl);
  return res.blob();
}

function getAspectSize(aspect: 'square' | 'story' | 'tweet'): {
  width: number;
  height: number;
} {
  switch (aspect) {
    case 'story':
      return { width: 1080, height: 1920 };
    case 'tweet':
      return { width: 1600, height: 900 };
    case 'square':
    default:
      return { width: 1080, height: 1080 };
  }
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  quizId,
  resultKey,
  result,
  answers,
  leadData,
  branding,
  translateText,
  resetQuiz,
  onExportImage,
}) => {
  const { translate } = useQuizTranslation();
  const aspect = 'square' as const; // Fixed square aspect for sharing
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const gradientClass = useMemo(
    () => `bg-gradient-to-r ${result.color}`,
    [result.color]
  );

  const generateBlob = useCallback(async () => {
    if (!exportRef.current) return null as Blob | null;
    const { width, height } = getAspectSize(aspect);
    setIsExporting(true);
    try {
      const blob = await rasterizeToPng(exportRef.current, width, height, 2);
      if (onExportImage) onExportImage(blob, { aspect });
      return blob;
    } finally {
      setIsExporting(false);
    }
  }, [onExportImage]);

  const handleDownload = useCallback(async () => {
    const blob = await generateBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quizId}-${resultKey}-${aspect}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [generateBlob, quizId, resultKey]);

  const shareText = useMemo(() => {
    const title = translateText(result.title);
    return (
      translate('ui.shareText', { title }) ||
      `I got "${title}" — try this quiz!`
    );
  }, [result.title, translateText, translate]);

  const tryNativeShare = useCallback(async () => {
    const blob = await generateBlob();
    if (!blob) return;
    try {
      // @ts-ignore -- navigator.share typing varies across envs
      if (
        navigator?.canShare &&
        navigator.canShare({
          files: [new File([blob], 'result.png', { type: 'image/png' })],
        })
      ) {
        // @ts-ignore
        await navigator.share({
          text: shareText,
          files: [
            new File([blob], `${quizId}-${resultKey}.png`, {
              type: 'image/png',
            }),
          ],
        });
        return true;
      }
    } catch (e) {
      // fall through to URL-based shares
    }
    return false;
  }, [generateBlob, quizId, resultKey, shareText]);

  const shareToX = useCallback(async () => {
    const usedNative = await tryNativeShare();
    if (usedNative) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  }, [shareText, tryNativeShare]);

  const shareToWhatsApp = useCallback(async () => {
    const usedNative = await tryNativeShare();
    if (usedNative) return;
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  }, [shareText, tryNativeShare]);

  const shareToInstagram = useCallback(async () => {
    const usedNative = await tryNativeShare();
    if (usedNative) return;
    // Fallback: download the image; user can upload to Instagram
    await handleDownload();
  }, [handleDownload, tryNativeShare]);

  const shareToTikTok = useCallback(async () => {
    const usedNative = await tryNativeShare();
    if (usedNative) return;
    // Fallback: download the image; user can upload to TikTok
    await handleDownload();
  }, [handleDownload, tryNativeShare]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <div className="text-sm text-green-600 font-medium">
            {translate('ui.quizComplete')}
          </div>
        </div>

        {/* Visible result card */}
        <div className={`${gradientClass} p-8 rounded-2xl text-white mb-8`}>
          <h1 className="text-3xl font-bold mb-4">
            {translateText(result.title)}
          </h1>
          <p className="text-lg opacity-90 mb-6">
            {translateText(result.description)}
          </p>
        </div>

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div className="text-left mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {translate('ui.recommendations')}
            </h3>
            <div className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{translateText(rec)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Primary CTA (screen) */}
        {result.cta && (
          <div className="space-y-3 mb-8">
            <button
              className={`w-full bg-gradient-to-r ${branding.colors.secondary} text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
            >
              {translateText(result.cta)}
            </button>
          </div>
        )}

        {/* Share controls */}
        <div className="border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Share2 className="w-5 h-5" /> {translate('ui.shareYourResult')}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={shareToX}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-800 hover:bg-gray-50"
            >
              <Twitter className="w-4 h-4" /> {translate('ui.shareX')}
            </button>
            <button
              onClick={shareToWhatsApp}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-800 hover:bg-gray-50"
            >
              <MessageCircle className="w-4 h-4" />{' '}
              {translate('ui.shareWhatsApp')}
            </button>
            <button
              onClick={shareToInstagram}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-800 hover:bg-gray-50"
            >
              <Instagram className="w-4 h-4" /> {translate('ui.shareInstagram')}
            </button>
            <button
              onClick={shareToTikTok}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-800 hover:bg-gray-50"
            >
              <Video className="w-4 h-4" /> {translate('ui.shareTikTok')}
            </button>
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-black"
            >
              <Download className="w-4 h-4" /> {translate('ui.downloadPNG')}
            </button>
          </div>
          {/* Offscreen render root for image with image-only CTA */}
          <div
            aria-hidden="true"
            style={{ position: 'absolute', left: '-99999px', top: 0 }}
          >
            <div
              ref={exportRef}
              className="relative overflow-hidden"
              style={{
                width: getAspectSize(aspect).width,
                height: getAspectSize(aspect).height,
              }}
            >
              <div className={`${gradientClass} absolute inset-0`} />
              <div className="absolute inset-0 p-16 flex flex-col">
                <div className="text-white">
                  {/* Larger typography for export */}
                  <div
                    className="font-extrabold leading-tight drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]"
                    style={{ fontSize: 68 }}
                  >
                    {translateText(result.title)}
                  </div>
                  <div
                    className="mt-6 opacity-95 max-w-3xl"
                    style={{ fontSize: 28, lineHeight: 1.4 }}
                  >
                    {translateText(result.description)}
                  </div>
                </div>
                {result.recommendations &&
                  result.recommendations.length > 0 && (
                    <div className="mt-10 bg-white/10 rounded-2xl p-8 text-white">
                      <div
                        className="font-semibold mb-4"
                        style={{ fontSize: 22 }}
                      >
                        {translate('ui.topRecommendations')}
                      </div>
                      <ul className="space-y-3">
                        {result.recommendations.slice(0, 5).map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="mt-1 inline-block w-2 h-2 rounded-full bg-white" />
                            <span
                              className="text-white/95"
                              style={{ fontSize: 20 }}
                            >
                              {translateText(rec)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                {/* Image-only CTA strip */}
                <div className="mt-auto">
                  <div
                    className={`w-full rounded-xl px-8 py-5 text-center text-white font-bold bg-gradient-to-r ${branding.colors.secondary}`}
                    style={{ fontSize: 26 }}
                  >
                    {translateText(
                      result.cta ||
                        ({ key: 'ui.exploreRecommendations' } as any)
                    )}
                  </div>
                  <div className="mt-4 text-white/80" style={{ fontSize: 16 }}>
                    #{quizId} • {resultKey}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={resetQuiz}
          className="w-full mt-6 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors"
        >
          {translate('ui.takeQuizAgain')}
        </button>
      </div>
    </div>
  );
};

export default ResultsView;
