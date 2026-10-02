import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    let timeoutId;

    async function verifyUserEmail() {
      try {
        const data = await verifyEmail(token);
        setSuccess(data.message);
        timeoutId = setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setError(error.response?.data?.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    }
    verifyUserEmail();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token, navigate]);
  if (loading) {
    return (
      <section className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold">Verifying your email...</h2>
          <p className="text-gray-500 mt-3">Please wait....</p>
        </div>
      </section>
    );
  }
  if (success) {
    return (
      <section className="min-h-screen flex justify-center items-center bg-gary-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mt-4">
            Email Verified
          </h2>
          <p className="text-gray-500 mt-2">{success}</p>
          <p className="text-gray-400 mt-3">Redirecting to login...</p>
        </div>
      </section>
    );
  }
  return (
    <section className="min-h-screen flex justify-center items-center bg-gary-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="text-6xl">❌</div>
        <h2 className="text-2xl font-bold text-red-600 mt-4">
          Verification Failed
        </h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <button
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate("/login")}
        >
          Go to login...
        </button>
      </div>
    </section>
  );
};

export default VerifyEmail;
