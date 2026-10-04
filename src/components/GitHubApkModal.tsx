import React, { useState } from 'react';
import {
  X,
  Github,
  Download,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Smartphone,
  Cpu,
  Sparkles,
  FolderArchive,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';

interface GitHubApkModalProps {
  onClose: () => void;
}

export const GitHubApkModal: React.FC<GitHubApkModalProps> = ({ onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'easy' | 'terminal'>('easy');

  const repoUrl = 'https://github.com/panda01real/contactlenses';
  const gitUrl = 'https://github.com/panda01real/contactlenses.git';
  const uploadUrl = 'https://github.com/panda01real/contactlenses/upload/main';

  const gitCommands = [
    'git init',
    `git remote add origin ${gitUrl}`,
    'git branch -M main',
    'git add .',
    'git commit -m "Subir app lentes de contacto"',
    'git push -u origin main',
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 my-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Tu Repo: panda01real/contactlenses
              </h3>
              <p className="text-xs text-slate-500">Subir código y obtener el archivo .APK</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Download ZIP button */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-indigo-500/10 border border-emerald-300 dark:border-emerald-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <FolderArchive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Descargar paquete completo del proyecto
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              ZIP Listo
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Descarga todos los archivos (código React, configuración de Android para APK y flujos de GitHub) en un solo archivo comprimido.
          </p>
          <a
            href="/contactlenses.zip"
            download="contactlenses.zip"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Descargar contactlenses.zip (524 KB)</span>
          </a>
        </div>

        {/* Method Switcher: Sin comandos (Fácil) vs Con comandos Git */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('easy')}
            className={`flex-1 py-2 rounded-xl transition ${
              activeTab === 'easy'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            1. Desde la web (Fácil, sin consola)
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex-1 py-2 rounded-xl transition ${
              activeTab === 'terminal'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            2. Con comandos Git
          </button>
        </div>

        {/* Tab 1: Easy method without console */}
        {activeTab === 'easy' && (
          <div className="space-y-3 animate-in fade-in">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-sky-500" />
              <span>Pasos para subirlo sin escribir ningún comando:</span>
            </h4>

            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="leading-relaxed">
                Descarga el archivo <strong>contactlenses.zip</strong> con el botón verde de arriba y <strong>descomprímelo</strong> en tu computadora.
              </li>
              <li className="leading-relaxed">
                Entra a tu repositorio en GitHub:{' '}
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-sky-600 dark:text-sky-400 underline inline-flex items-center gap-0.5"
                >
                  <span>github.com/panda01real/contactlenses</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="leading-relaxed">
                Haz clic en el enlace que dice <strong>"uploading an existing file"</strong> o en el botón <strong>Add file &gt; Upload files</strong>.
              </li>
              <li className="leading-relaxed">
                Arrastra y suelta todos los archivos y carpetas que descomprimiste dentro de esa página.
              </li>
              <li className="leading-relaxed">
                Haz clic abajo en el botón verde <strong>"Commit changes"</strong>. ¡Y listo!
              </li>
            </ol>
          </div>
        )}

        {/* Tab 2: Terminal commands */}
        {activeTab === 'terminal' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Ejecuta en tu terminal dentro de la carpeta:
              </span>
              <button
                type="button"
                onClick={() => handleCopy(gitCommands.join(' && '), 99)}
                className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold hover:underline"
              >
                {copiedIndex === 99 ? '¡Copiados todos!' : 'Copiar todo junto'}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1.5">
              {gitCommands.map((cmd, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-1 rounded-md hover:bg-slate-800">
                  <span className="break-all">{cmd}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(cmd, idx)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What happens next: Automatic APK */}
        <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 space-y-1">
          <span className="font-bold text-xs text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-sky-500" />
            ¿Cómo obtienes el .APK una vez subido?
          </span>
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            Apenas los archivos estén en tu repo, ve a la pestaña <strong>Actions</strong> en GitHub. Verás la compilación automática de Android. Al terminar, descargas el archivo <strong>OcuTrack-Android-APK</strong> con tu <code>app-debug.apk</code> para instalar en tu Samsung S23 FE.
          </p>
        </div>

        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
