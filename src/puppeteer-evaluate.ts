import { Tracing } from "trace_events";

interface food {
    title : string;
    description : string | string[];
    price : string | string[];
}

interface foodtype {
    title : string;
    content : food[];
}

interface foodsObject {
    foods : foodtype[];
}

export class Selectors {
    MenuTitle : string;
    Title : string;
    TitleAlt : string;
    Content : string;
    Price : string;
    constructor (menuTitle: string, title: string, titleAlt: string, content: string, price: string) {
        this.MenuTitle = menuTitle;
        this.Title = title;
        this.TitleAlt = titleAlt;
        this.Content = content;
        this.Price = price;
    }
}

export async function extractList(page, selectors) : Promise<[foodsObject]> {
    return await page.evaluate((data: Selectors) : [foodsObject] => {

        const titles : NodeListOf<HTMLHeadingElement> = document.querySelectorAll(data.MenuTitle);
        var obj : foodsObject = { foods: [] };
        Array.from(titles).forEach(title => {
            const food : food[] = Array.from(title.nextElementSibling.nextElementSibling.getElementsByTagName("li"))
                .map(li => {
                    const findtitle  = (sel1 : HTMLSpanElement, sel2 : HTMLHeadingElement ) : string => (sel1 || sel2).innerHTML;

                    var findElems = (sel: NodeListOf<HTMLParagraphElement | HTMLSpanElement>) : string[] | string => {
                        var xelem = Array.from(sel);
                        return xelem.length > 1 ? xelem.map(el => el.innerHTML) : xelem[0].innerHTML
                    }
  
                    return {
                        "title": findtitle(li.querySelector<HTMLSpanElement>(data.Title), li.querySelector<HTMLHeadingElement>(data.TitleAlt)),
                        "description": findElems(li.querySelectorAll<HTMLParagraphElement>(data.Content)),
                        "price": findElems(li.querySelectorAll<HTMLSpanElement>(data.Price))
                    }
                });
            const hasObject : boolean = obj.foods.some(s => s.title == title.innerHTML);   
            obj.foods.push({ title: (hasObject ? 'Familie-' + title.innerHTML : title.innerHTML), content: food });
        });
        return [obj];
    }, selectors);
};