const SubmitLoadingButton = ({ isLoading, children, submitText = "Procesando...", ...props }) => {
  return (
    <button
      {...props}
      className={`mt-5 border-2 text-center text-sm md:text-lg h-[44px] px-8 rounded-[5px] font-semibold ${isLoading ? 'button-disabled' : 'secondary-bg-button hover:secondary-bg-button hover:border-opacity-10 border-primary'} transition duration-300 ease-in-out w-full text-primary hover:border-opacity-10 ${isLoading ? 'cursor-not-allowed' : ''}`}
      disabled={isLoading}
    >
      {isLoading ? submitText : children}
    </button>
  );
};

export default SubmitLoadingButton;
