const fs = require('fs');

let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

const oldSection = `{/* Notifications & Privacy */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col space-y-4">
          <div className="flex items-center gap-3 text-slate-800 font-semibold mb-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            {t(language, 'settings.notifications')}
          </div>
          <button className="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left">
            <div className="flex items-center gap-3 text-slate-700">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Bell className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="font-medium text-sm">{t(language, 'settings.push')}</p>
                <p className="text-xs text-slate-500">{t(language, 'settings.pushDesc')}</p>
              </div>
            </div>
            <div className="w-10 h-6 bg-emerald-500 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
            </div>
          </button>


        </div>`;

const newSection = `{/* Profile Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col space-y-4">
          <div className="flex items-center gap-3 text-slate-800 font-semibold mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              U
            </div>
            {t(language, 'settings.profile') || "Profile Details"}
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">{t(language, 'settings.name') || "Name"}</label>
            <input 
              type="text" 
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700" 
              placeholder="Your name" 
              defaultValue="Farmer"
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">{t(language, 'settings.email') || "Email"}</label>
            <input 
              type="email" 
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700" 
              placeholder="Your email" 
              defaultValue="farmer@example.com"
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">{t(language, 'settings.phone') || "Phone Number"}</label>
            <input 
              type="tel" 
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700" 
              placeholder="Your phone number" 
              defaultValue="+91 9876543210"
            />
          </div>
        </div>`;

code = code.replace(oldSection, newSection);

fs.writeFileSync('src/components/Settings.tsx', code);
