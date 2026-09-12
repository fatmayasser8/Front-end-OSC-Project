import { refreshAccessToken } from "./refreshToken";

export const apiFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  const makeRequest = async (token) => {
    const isFormData = options.body instanceof FormData;

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        // التعديل 1: التأكد من إرسال التوكن بصيغة صحيحة، وإذا لمط يتوفر لا نرسل سطر Authorization وهمياً
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
  };

  let response = await makeRequest(accessToken);

  // إذا انتهت صلاحية التوكن (401)
  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    // التعديل 2: إذا فشل الـ Refresh تماماً، نقوم بتوجيه المستخدم لتسجيل الدخول بدلاً من الدوران في حلقة مفرغة
    if (!newAccessToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; // توجيه لصفحة تسجيل الدخول
      return response;
    }

    // التعديل 3: حفظ الـ Token الجديد في الـ localStorage لتجنب تكرار الخطأ
    localStorage.setItem("accessToken", newAccessToken);

    // إعادة محاولة الطلب الأصلي بالتوكن الجديد
    response = await makeRequest(newAccessToken);
  }

  return response;
};