import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";
import Button from "../components/ui/Button";


function HistoryTable({
  history = [],
}) {

  const { language } =
    useLanguage();

  const t =
    translations[language];

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-xl font-semibold">
            {t.predictionHistory}
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            {t.predictionRecords}
          </p>

        </div>

        <Button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm">
          {t.export}
        </Button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="text-left text-gray-400 text-sm border-b border-gray-100">

              <th className="pb-4">
                {t.month}
              </th>

              <th className="pb-4">
                {t.usage}
              </th>

              <th className="pb-4">
                {t.bill}
              </th>

              <th className="pb-4">
                {t.status}
              </th>

            </tr>

          </thead>

          <tbody>

            {history.map((item, index) => (

              <tr
                key={index}
                className="border-b border-gray-50"
              >

                <td className="py-5 font-medium">

                  {language === "id"
                    ? item.month === "January"
                      ? "Januari"
                      : item.month === "February"
                        ? "Februari"
                        : "Maret"
                    : item.month}

                </td>

                <td className="py-5">
                  {item.usage}
                </td>

                <td className="py-5">
                  {item.bill}
                </td>

                <td className="py-5">

                  <span
                    className={`px-3 py-1 rounded-full text-xs
                    ${item.status === "High"
                        ? "bg-red-100 text-red-500"
                        : item.status === "Normal"
                          ? "bg-blue-100 text-blue-500"
                          : "bg-green-100 text-green-500"
                      }`}
                  >

                    {language === "id"
                      ? item.status === "High"
                        ? "Tinggi"
                        : item.status === "Normal"
                          ? "Normal"
                          : "Rendah"
                      : item.status}

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default HistoryTable;