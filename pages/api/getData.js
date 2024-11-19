import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("marvel-showdown-data");

    if (req.method === "GET") {
      const { collection } = req.query;

      if (!collection) {
        return res.status(400).json({ error: "Collection name required" });
      }

      if (!["stats", "powers"].includes(collection)) {
        return res.status(400).json({ error: "Invalid Collection Name" });
      }

      const data = await db.collection(collection).find({}).toArray();
      console.log("Fetched data:", data); // Debug log
      res.status(200).json(data);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} not allowed`);
    }
  } catch (error) {
    console.error("Error in API handler:", error); // Debug log
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// routes
// http://localhost:3000/api/getData?collection=stats
// http://localhost:3000/api/getData?collection=powers
