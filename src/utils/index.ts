export const downloadExportExcel = (resp: Blob, fileName: string) => {
  const blob = resp
  const downloadElement = document.createElement("a")
  const href = window.URL.createObjectURL(blob) //创建下载的链接
  downloadElement.href = href
  downloadElement.download = fileName + ".xls" //下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() //点击下载
  document.body.removeChild(downloadElement) //下载完成移除元素
  window.URL.revokeObjectURL(href) //释放掉blob对象
}
