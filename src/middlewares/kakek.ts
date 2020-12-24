export default function kakek(req, res, next) {
  try {
    const { key } = req.body;
    if (key == 1) {
      console.log("lanjut");
    } else {
      next();
    }
  } catch {
    console.log("pack ga bisa");
  }
}
