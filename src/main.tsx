import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner"; // برای نمایش نوتیفیکیشن‌ها
import { store } from "./app/store";
import { router } from "./app/routes";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* روتر جدید اینجا تزریق می‌شود */}
      <RouterProvider router={router} />

      {/* کامپوننت نمایش تست و خطاها */}
      <Toaster position="top-center" richColors />
    </Provider>
  </React.StrictMode>
);
