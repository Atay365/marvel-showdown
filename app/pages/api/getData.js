import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("marvel-showdown-data");

    if (req.method === "GET") {
      const data = await db.collection("stats").find({}).array();
      res.status(200).json(data);
    } else {
      res.header("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} not allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
