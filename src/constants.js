export const CITIES = [
  "الخرطوم",
  "أم درمان",
  "بحري",
  "بورتسودان",
  "كسلا",
  "ود مدني",
  "الأبيض",
  "نيالا",
  "الفاشر",
  "عطبرة",
  "القضارف",
  "كوستي",
  "سنار",
  "الدمازين",
  "دنقلا",
  "الجنينة",
];

export const SPECIALTIES = [
  "طب عام",
  "أسنان",
  "نساء وتوليد",
  "أطفال",
  "عظام",
  "جلدية وتجميل",
  "عيون",
  "باطنية",
  "قلب وأوعية دموية",
  "أنف وأذن وحنجرة",
  "مسالك بولية",
  "نفسية وعصبية",
  "جراحة عامة",
  "أشعة وتحاليل",
  "علاج طبيعي",
];

export const FACILITY_TYPES = [
  { value: "clinic", label: "عيادة خاصة" },
  { value: "hospital", label: "مستشفى" },
];

export const APPOINTMENT_STATUS = {
  pending: { label: "بانتظار التأكيد", color: "clay" },
  confirmed: { label: "مؤكد", color: "teal" },
  cancelled: { label: "ملغى", color: "danger" },
  completed: { label: "تم الكشف", color: "ink" },
};
