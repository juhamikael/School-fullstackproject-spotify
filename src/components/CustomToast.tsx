import { ToastContainer } from "react-toastify";

const CustomToast = (props: { location: any; }) => {
  const location = props.location;
  return (
      <ToastContainer
        position={location}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
  );
};

export default CustomToast;