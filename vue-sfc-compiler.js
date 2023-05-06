
// based one code from: https://github.com/vuejs/vue-loader

// node
// import { parse, compileScript, compileTemplate, compileStyle } from 'vue/compiler-sfc'
// import hash from 'hash-sum'

// deno/qjs compatibility
// import { parse, compileScript, compileTemplate, compileStyle } from './node_modules/@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js'

// node/deno/qjs
import { parse, compileScript, compileTemplate, compileStyle } from './compiler-sfc.esm-browser.js'
import hash from './hash-sum.js';

function genCSSModulesCode(
  id,//: string,
  index,//: number,
  request,//: string,
  moduleName, //: string | boolean,
  needsHotReload//: boolean
)/* : string */ {
  const styleVar = `style${index}`
  let code = `\nimport ${styleVar} from ${request}`

  // inject variable
  const name = typeof moduleName === 'string' ? moduleName : '$style'
  code += `\ncssModules["${name}"] = ${styleVar}`

  if (needsHotReload) {
    code += `
if (module.hot) {
  module.hot.accept(${request}, () => {
    cssModules["${name}"] = ${styleVar}
    __VUE_HMR_RUNTIME__.rerender("${id}")
  })
}`
  }

  return code
}

// these are built-in query parameters so should be ignored
// if the user happen to add them as attrs
const ignoreList = ['id', 'index', 'src', 'type']

// function attrsToQuery(attrs: SFCBlock['attrs'], langFallback?: string): string {
function attrsToQuery(attrs, langFallback) {
  let query = ``
  for (const name in attrs) {
    const value = attrs[name]
    if (!ignoreList.includes(name)) {
      query += `&${encodeURIComponent(name)}=${value ? encodeURIComponent(value) : ``}`
    }
  }
  if (langFallback && !(`lang` in attrs)) {
    query += `&lang=${langFallback}`
  }
  return query
}

export function loadSFC(source, resourcePath, options = {}) {

  const filename = resourcePath

  const { descriptor, errors } = parse(source, {
    filename,
    // sourceMap,
  })

  const isProduction = options.isProduction || false;

  // import hash = require('hash-sum')
  // module id for scoped CSS & hot-reload
  // const rawShortFilePath = path
  //   .relative(rootContext || process.cwd(), filename)
  //   .replace(/^(\.\.[\/\\])+/, '')
  // const rawShortFilePath = filename
  // const shortFilePath = rawShortFilePath.replace(/\\/g, '/')
  // const id = hash(
  //   isProduction
  //     ? shortFilePath + '\n' + source.replace(/\r\n/g, '\n')
  //     : shortFilePath
  // )

  const id = options.id || hash(resourcePath)

  const needsHotReload = false

  // script

  // const scopeId = 'some-scope-id'
  // const scopeId = `data-v-${id}`
  const isProd = isProduction
  const enableInline = options.enableInline || false
  const isServer = false

  const script = compileScript(descriptor, {
    id,
    isProd,
    inlineTemplate: enableInline,
    // reactivityTransform: options.reactivityTransform,
    // babelParserPlugins: options.babelParserPlugins,
    templateOptions: {
      ssr: isServer,
      // compiler: templateCompiler,
      // compilerOptions: {
      //   ...options.compilerOptions,
      //   ...resolveTemplateTSOptions(descriptor, options),
      // },
      // transformAssetUrls: options.transformAssetUrls || true,
      transformAssetUrls: true,
    },
  })

  const scoped = options.scoped !== undefined ? options.scoped : true
  const scopeId = `data-v-${id}`

  let template

  if(descriptor.template && descriptor.template.content) {
    template = compileTemplate({
      source: descriptor.template.content,
      filename,//: loaderContext.resourcePath,
      // inMap,
      id,
      scoped,//: !!query.scoped,
      slotted: descriptor.slotted,
      // isProd,
      // ssr: isServer,
      // ssrCssVars: descriptor.cssVars,
      // compiler: templateCompiler,
      compilerOptions: {
        // ...options.compilerOptions,
        scopeId,
        // scopeId: [# query. #]scoped ? scopeId : undefined,
        // bindingMetadata: script ? script.bindings : undefined,
        // ...resolveTemplateTSOptions(descriptor, options),
      },
      // transformAssetUrls: options.transformAssetUrls || true,
    })
  }

  const styles = []
  let stylesCode = ''

  if(descriptor.styles && descriptor.styles.length > 0) {
    const nonWhitespaceRE = /\S+/
    let hasCSSModules = false
    let i = 0
    for(const style of descriptor.styles) {
      // const style = descriptor.styles[i]
      if(!(style.src || nonWhitespaceRE.test(style.content))) {
        continue
      }

      if(style.src) {
        styles.push({})
      } else if(style.content) {
        const { code, map, errors } = compileStyle({
          source: style.content,
          filename: resourcePath,
          id: scopeId,
          map: style.map,
          scoped,
          trim: true,
          isProd,
        })

        styles.push({
          code,
          map,
          errors,
          raw: style,
        })
      }

      const src = style.src || resourcePath
      const attrsQuery = attrsToQuery(style.attrs, 'css')
      // make sure to only pass id when necessary so that we don't inject
      // duplicate tags when multiple components import the same css file
      const idQuery = !style.src || style.scoped ? `&id=${id}` : ``
      // const inlineQuery = asCustomElement ? `&inline` : ``
      const inlineQuery = ``
      const query = `?vue&type=style&index=${i}${idQuery}${inlineQuery}${attrsQuery}`//`${resourceQuery}`
      // const styleRequest = stringifyRequest(src + query)
      const styleRequest = src + query
      if (style.module) {
        if (!hasCSSModules) {
          stylesCode += `\nconst cssModules = {}`
          propsToAttach.push([`__cssModules`, `cssModules`])
          hasCSSModules = true
        }
        stylesCode += genCSSModulesCode(
          id,
          i,
          styleRequest,
          style.module,
          needsHotReload
        )
      } else {
        stylesCode += `\nimport ${styleRequest}`
      }
      i++;
    }
  }

  const imports = [];

  if(template) {
    imports.push(`import { render } from '${resourcePath}?vue&type=template&id=${id}'`)
    imports.push(`script.render = render`)
  }
  if(stylesCode.length > 0) {
    imports.push(stylesCode)
  }

  let code = `
// main script
import script from '${resourcePath}?vue&type=script'
// template compiled to render function
// import { render } from '${resourcePath}?vue&type=template&id=${id}'
// css
// import '${resourcePath}?vue&type=style&index=0&id=${id}'

${imports.join('\n')}

// attach render function to script
// script.render = render

// attach additional metadata
// some of these should be dev only
script.__file = '${resourcePath}'
script.__scopeId = '${scopeId}'

// additional tooling-specific HMR handling code
// using __VUE_HMR_API__ global

export default script
  `

  return {
    descriptor,
    errors,
    script,
    template,
    styles,
    code,
  }
}

