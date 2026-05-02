// messageall.js
function openMessageAll(type) {
  const students = type==="dues"
    ? window.students.filter(s=>getStudentFeeStatus(s)!=="green")
    : window.students;
  if(!students.length){toast("No students to message","red");return;}
  const phones = students.map(s=>s.phone).filter(Boolean);
  if(!phones.length){toast("No phone numbers found","red");return;}
  const msg = type==="dues"
    ? "Dear Parent, your child has outstanding fees. Please clear dues at the earliest. — FeeStacks"
    : "Dear Parent, this is a message from your coaching centre. — FeeStacks";
  phones.forEach(p=>{
    window.open("https://wa.me/"+p.replace(/\D/g,"")+"?text="+encodeURIComponent(msg),"_blank");
  });
}
