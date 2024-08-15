
export function logResult(result) {

  const {
      descriptor,
      errors,
      script,
      template,
      styles,
      code,
  } = result;

  // console.log('------- RESULT ------')
  // console.log(result)
  // console.log('------- End of RESULT ------')
  // console.log()

  console.log('------- DESCRIPTOR ------')
  console.log(descriptor)
  console.log('------- End of DESCRIPTOR ------')
  console.log()

  console.log('------- ERRORS ------')
  console.log(errors)
  console.log('------- End of ERRORS ------')
  console.log()

  console.log('------- SCRIPT ------')
  console.log(script)
  console.log('------- End of SCRIPT ------')
  console.log()

  console.log('------- SCRIPT.content ------')
  console.log(script.content)
  console.log('------- End of SCRIPT.content ------')
  console.log()

  console.log('------- TEMPLATE ------')
  console.log(template)
  console.log('------- End of TEMPLATE ------')
  console.log()

  console.log('------- TEMPLATE.code ------')
  console.log(template.code)
  console.log('------- End of TEMPLATE.code ------')
  console.log()

  console.log('------- STYLES ------')
  console.log(styles)
  // console.log('------- End of STYLES ------')
  // console.log('------- STYLES ------')
  // for (const style of styles) {
  for (const i in styles) {
    const style = styles[i];
    console.log(`--- STYLE [${i}] ---`);
    console.log(style.code);
    console.log(`--- End of STYLE [${i}] ---`);
  }
  console.log('------- End of STYLES ------')
  console.log()

  console.log('------- CODE ------')
  console.log(code)
  console.log('------- End of CODE ------')
  console.log()
}

export default logResult;
