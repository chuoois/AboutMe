export default function PublicLoading() {
  return (
    <section className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl h-[85vh] md:h-[650px] rounded-mac-window bg-mac-dark-window/90 backdrop-blur-mac border border-mac-dark-border shadow-mac-window-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 rounded-full animate-spin border-mac-dark-subtext border-t-mac-dark-text" />
          <p className="text-mac-dark-subtext text-sm font-medium">Loading...</p>
        </div>
      </div>
    </section>
  );
}
