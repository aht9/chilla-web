import logoChilla from "../../../assets/logo-chilla-login.svg";

export const AuthBanner = () => (
  <div className="hidden lg:flex flex-col justify-between bg-green-950 text-white w-1/2 p-12 m-4 rounded-[40px] relative overflow-hidden">
    {/* Abstract Background Effect */}
    <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-700 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-green-900 rounded-full blur-[120px]"></div>
    </div>

    <div className="z-10">
      <div className="flex items-center gap-2 mb-20">
        <div className="w-10 h-10 bg-gradient-to-tr from-white to-green-900 rounded-lg flex items-center justify-center font-bold text-xl">
          چ
        </div>
        <span className="font-bold text-م tracking-wider">
          تغییر، از همین چله آغاز می‌شود...
        </span>
      </div>

      <div className="flex justify-center mb-10">
        <img src={logoChilla} />
      </div>

      <h2 className="text-4xl font-bold mb-4">به چله خوش آمدید </h2>
      {/* <p className="text-gray-400 leading-relaxed max-w-md">
        چله؛ تمرین تداوم.{" "}
      </p> */}
    </div>

    {/* Bottom Card */}
    <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-3xl border border-gray-700 z-10 relative mt-8">
      <h3 className="text-l font-bold mb-2 text-justify">
        «چله» فراتر از یک بازه زمانی چهل‌روزه است؛ این یک دعوت به استمرار است.
        در دنیایی که همه به دنبال نتایج آنی هستند، این شعار یادآوری می‌کند که
        راز تغییرات بزرگ، نه در شدت تلاش، بلکه در "تداوم" آن نهفته است. "تمرین
        تداوم" یعنی ساختن اراده‌ای که با تکرارِ آگاهانه، عادت‌های گذرا را به
        بخشی جدایی‌ناپذیر و ماندگار از سبک زندگی شما تبدیل می‌کند.{" "}
      </h3>
    </div>
  </div>
);
