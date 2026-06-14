using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Services
{
    public class LogService : ILogService
    {
        private static object _lock = new object();
        private string _logPath = ".";
        private string fileName = "LOG_" + DateTime.Today.ToString("ddMMyyyy") + ".txt";
        private int _logLevel = 0;
        private readonly LoggingSettings loggingSettings;
        public LogService(IAppSettingsService appSettingsService)
        {
            loggingSettings = appSettingsService.GetLoggingSettings();

        }

        public void Add(string user, string source, string entry)
        {
            var filePath = loggingSettings.Log_Dir;
            var isLog = loggingSettings.IsLog;
            if (isLog == "N")
            {
                return;
            }
            _logPath = filePath + @"\" + fileName;

            //create log file in filePath if it doesnt exist
            if (!File.Exists(_logPath))
            {
                Directory.CreateDirectory(_logPath.Substring(0, _logPath.LastIndexOf(@"\")));
                var fs = File.Create(_logPath);
                fs.Close();
            }

            var dtNow = DateTime.Now.ToString("yyyyMMddHHmmss");
            string contents = dtNow + " " + user + " " + source + " " + entry;

            Debug.WriteLine(dtNow + " " + contents);

            lock (_lock)
            {
                File.AppendAllText(_logPath, contents + Environment.NewLine);
            }
        }

        public void AddServiceLog(string user, string heading, string source, string ServiceName)
        {
            var filePath = loggingSettings.Log_Dir;
            var isLog = loggingSettings.IsLog;
            if (isLog == "N")
            {
                return;
            }
            _logPath = filePath + @"\" + ServiceName + "_" + fileName;

            //create log file in filePath if it doesnt exist
            if (!File.Exists(_logPath))
            {
                Directory.CreateDirectory(_logPath.Substring(0, _logPath.LastIndexOf(@"\")));
                var fs = File.Create(_logPath);
                fs.Close();
            }

            var dtNow = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            string contents = "[" + dtNow + ", User:" + user + "]: ";
            string contents1 = (contents + " ----------Log Start--------");
            string contents2 = (contents + " " + heading);
            string contents3 = (contents + " " + source);
            string contents4 = (contents + " ----------Log End----------");
            lock (_lock)
            {
                File.AppendAllText(_logPath, contents1 + Environment.NewLine);
                File.AppendAllText(_logPath, contents2 + Environment.NewLine);
                File.AppendAllText(_logPath, contents3 + Environment.NewLine);
                File.AppendAllText(_logPath, contents4 + Environment.NewLine);
                File.AppendAllText(_logPath, "." + Environment.NewLine);
            }
        }
    }
}
