// "use client";
// import { createClient } from "@/utils/supabase/client";
// import { useEffect, useState } from "react";
//
// type Note = {
//   id: string;
//   title: string;
// };
//
// export default function Notes() {
//   const supabase = createClient();
//   // const { data: notes } = await supabase.from("notes").select();
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     const fetchNotes = async () => {
//       const { data: notes, error } = await supabase.from("notes").select();
//
//       setNotes(notes);
//       setLoading(false);
//     };
//
//     fetchNotes();
//   }, []);
//
//   const postNewNote = async () => {
//     const title = prompt("Enter note title");
//
//     if (!title) return;
//
//     const { data: note, error } = await supabase.from<Note>("notes").insert({
//       title,
//     });
//
//     setNotes((prevNotes) => [...prevNotes, note!]);
//   };
//
//   return (
//     <div>
//       {loading && <p>Loading...</p>}
//       <h1>Notes</h1>
//       {notes?.map((note) => (
//         <div key={note.id}>
//           <h2>{note.title}</h2>
//         </div>
//       ))}
//     </div>
//   );
// }
