import {
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/layout/Sidebar";

import Header from "../components/layout/Header";

import LoadingSpinner from "../components/common/LoadingSpinner";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/common/ErrorMessage";

import {
  getPredictions,
} from "../services/predictionService";

function HistoryPage() {

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory =
    async () => {

      try {

        setLoading(true);

        const data =
          await getPredictions();

        setHistory(data);

      } catch (err) {

        setError(
          err.message
        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <div className="flex bg-[#f7f9fc] min-h-screen">

      <Sidebar />

      <main className="flex-1 p-8">

        <Header />

        <div className="bg-white rounded-[32px] p-6 shadow-sm mt-6">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-xl font-semibold">
                Prediction History
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Electricity prediction records
              </p>

            </div>

          </div>

          {
            loading && (
              <LoadingSpinner />
            )
          }

          {
            error && (
              <ErrorMessage
                message={error}
              />
            )
          }

          {
            !loading &&
            !error && (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="text-left text-gray-400 text-sm border-b border-gray-100">

                      <th className="pb-4">
                        Month
                      </th>

                      <th className="pb-4">
                        Usage
                      </th>

                      <th className="pb-4">
                        Bill
                      </th>

                      <th className="pb-4">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {
                      history.map(
                        (
                          item,
                          index
                        ) => (

                          <tr
                            key={index}
                            className="border-b border-gray-50"
                          >

                            <td className="py-5 font-medium">
                              {
                                item.month
                              }
                            </td>

                            <td className="py-5">
                              {
                                item.usage
                              }
                            </td>

                            <td className="py-5">
                              Rp{" "}
                              {
                                Number(
                                  item.bill
                                ).toLocaleString(
                                  "id-ID"
                                )
                              }
                            </td>

                            <td className="py-5">

                              <span
                                className={`px-3 py-1 rounded-full text-xs
                                ${
                                  item.status ===
                                  "High"
                                    ? "bg-red-100 text-red-500"
                                    : item.status ===
                                      "Normal"
                                    ? "bg-blue-100 text-blue-500"
                                    : "bg-green-100 text-green-500"
                                }`}
                              >

                                {
                                  item.status
                                }

                              </span>

                            </td>

                          </tr>
                        )
                      )
                    }

                  </tbody>

                </table>

              </div>
            )
          }

        </div>

      </main>

    </div>
  );
}

export default HistoryPage;