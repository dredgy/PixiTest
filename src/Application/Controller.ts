export const yieldElement = (Element: JQuery<Element>) => Element.prop('outerHTML')
export const yieldElements = (ElementArray : JQuery<Element>[]) => ElementArray.reduce((htmlString : string, element) => htmlString + yieldElement(element), '')
