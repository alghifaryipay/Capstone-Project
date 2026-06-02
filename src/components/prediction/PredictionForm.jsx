import { useState } from "react";

import toast from "react-hot-toast";
import translations from "../../utils/translations";

import { useLanguage } from "../../context/LanguageContext";

function PredictionForm() {
  const { language } =
    useLanguage();

  const t =
    translations[language] ||
    translations.en;

  const [formData, setFormData] =
    useState({
      members: "",
      ac: "",
      tv: "",
      fridge: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "predictionData",
      JSON.stringify(formData)
    );

    toast.success(
      t.predictionGenerated
    );
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm">
      <h2 className="text-2xl font-bold">
        {t.generatePrediction}
      </h2>

      <p className="text-gray-400 mt-2">
        {t.fillUsage}
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mt-8"
      >
        <input
          type="number"
          name="members"
          placeholder={t.familyMembers}
          value={formData.members}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-2xl p-4"
        />

        <input
          type="number"
          name="ac"
          placeholder={`${t.airConditioner} (${t.dailyUsageHours})`}
          value={formData.ac}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-2xl p-4"
        />

        <input
          type="number"
          name="tv"
          placeholder={`${t.television} (${t.dailyUsageHours})`}
          value={formData.tv}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-2xl p-4"
        />

        <input
          type="number"
          name="fridge"
          placeholder={`${t.refrigerator} (${t.dailyUsageHours})`}
          value={formData.fridge}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-2xl p-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-medium hover:bg-blue-700 transition-all"
        >
          {t.generatePrediction}
        </button>
      </form>
    </div>
  );
}

export default PredictionForm;