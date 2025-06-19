import { Input } from "../atoms/input";

export const FormField = ({ id, label, ...inputProps }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-400">
        {label}
      </label>
      <Input id={id} {...inputProps} />
    </div>
  );
};