const API_URL = "http://127.0.0.1:8000";

export const getAnalyses = async () => {
  const response = await fetch(`${API_URL}/analyses`);
  if (!response.ok) throw new Error("Erreur de récupération");
  return response.json();
};

export const getAnalysisById = async (id: string) => {
  const response = await fetch(`${API_URL}/analyses/${id}`);
  if (!response.ok) throw new Error("Erreur lors de la récupération du rapport");
  return response.json();
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};