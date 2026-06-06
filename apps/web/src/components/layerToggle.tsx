type LayerToggleProps = {
  label: string;
  active: boolean;
  onChange: () => void;
  activeColor: string;
};

export function LayerToggle({
  label,
  active,
  onChange,
  activeColor,
}: LayerToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`px-3 py-1 rounded-full text-sm transition ${
        active ? `${activeColor} text-white` : "bg-white text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}