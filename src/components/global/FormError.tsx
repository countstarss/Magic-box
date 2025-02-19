import React from "react";

interface FormErrorProps {
  errors: Record<string, any>; // react-hook-form 的错误对象
}

const FormError: React.FC<FormErrorProps> = ({ errors }) => {
  return (
    <div className="text-red-500 mt-2 space-y-2">
      {Object.keys(errors).map((key) => (
        <div key={key}>
          <strong>{key}:</strong> {errors[key]?.message || "无效输入"}
        </div>
      ))}
    </div>
  );
};

export default FormError;