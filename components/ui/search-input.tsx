'use client';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accentColor?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  accentColor = 'blue',
}: SearchInputProps) {
  return (
    <div className="relative w-48 md:w-64">
      <i className='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm' />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-[#f0f0f2] border border-black/5 rounded-md py-1.5 pl-9 pr-3 text-sm text-[#1d1d1f] 
                   placeholder:text-[#86868b] focus:outline-none focus:ring-1 focus:ring-${accentColor}-500/50 transition-all`}
      />
    </div>
  );
}
