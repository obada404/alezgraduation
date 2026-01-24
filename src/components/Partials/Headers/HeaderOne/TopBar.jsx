export default function TopBar({ className }) {
  return (
    <>
      <div
        className={`w-full bg-white h-10 border-b border-qgray-border ${
          className || ""
        }`}
      >
        <div className="container-x mx-auto h-full">
          {/* Top bar is now empty - all content moved to navbar */}
        </div>
      </div>
    </>
  );
}
