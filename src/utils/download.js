export default function(url) {
  // const blob = new Blob([content]);
  const a = document.createElement('a');
  // const url = window.URL.createObjectURL(blob);
  // const filename = fileName;
  a.href = url;
  // a.download = filename;
  a.click();
  // window.URL.revokeObjectURL(url);
}
