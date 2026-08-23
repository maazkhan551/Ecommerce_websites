function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-10 w-10 rounded-full border-4 border-navy/10 border-t-electric animate-spin"></div>
      <p className="mt-4 text-sm text-navy/60">{text}</p>
    </div>
  );
}

export default Loader;