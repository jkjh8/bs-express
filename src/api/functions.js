module.exports.objToStr = (obj) => {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value ?? 'null'}`)
    .join(', ')
}

module.exports.objTokv = (obj) => {
  return `이름=${obj.name ?? ' '},${
    obj.ipaddress ? ' 아이피주소=' + obj.ipaddress + ',' : ''
  } Index: ${obj.index}, Type=${obj.deviceType}, Mode=${obj.mode}`
}

module.exports.zoneToStr = (obj) => {
  return `이름=${obj.name}, Core=${obj.core.name}:${obj.core.ipaddress}, Index=${obj.index}`
}
