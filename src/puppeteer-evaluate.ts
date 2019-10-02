
interface food {
    title : string;
    description : string | string[];
    price : string | string[];
}

interface foodStrict {
    title : string;
    description : string;
    price : string;
}

interface foodtype {
    title : string;
    content : foodStrict[];
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

export async function extractList(page, selectors) : Promise<foodsObject> {
    return await page.evaluate((data: Selectors) : foodtype[] => {

        const titles : NodeListOf<HTMLHeadingElement> = document.querySelectorAll(data.MenuTitle);
        const obj : foodtype[] =  [];
        const findtitle  = (sel1 : HTMLSpanElement, sel2 : HTMLHeadingElement ) : string => (sel1 || sel2).innerHTML;
        const findElems = (sel: NodeListOf<HTMLParagraphElement | HTMLSpanElement>) : string[] | string => {
            var xelem = Array.from(sel);
            return xelem.length > 1 ? xelem.map(el => el.innerHTML) : xelem[0].innerHTML
        }
        function determineNestedArrayLength (obj : food) : undefined[] {
            var arr : undefined[] = [];
            for (let f in obj) {
                if (Array.isArray(obj[f])) {
                    arr = Array.from({length : obj[f].length});
                    break;
                }
            }
            return arr;
        }
        function extractToArray (arr : undefined[], obj : food) : foodStrict[] | null {
            if (arr.length > 0) {
                var arrayFood : foodStrict[] = arr.map((u : undefined ,index : number ) => {
                    var clone : food = JSON.parse(JSON.stringify(obj))
                    for (let c in clone) {
                        clone[c] = Array.isArray(clone[c]) ? clone[c].filter((val : string, ind: number ) => ind === index)[0] : clone[c]
                    }
                    return clone as foodStrict;
                });
                return arrayFood; 
            } 
            return null;
        }

        Array.from(titles).forEach(title => {
            const food : (foodStrict | foodStrict[])[] = Array.from(title.nextElementSibling.nextElementSibling.getElementsByTagName("li"))
                .map((li, index) => {
                    
                    const foodobj : food =  {
                        "title": findtitle(li.querySelector<HTMLSpanElement>(data.Title), li.querySelector<HTMLHeadingElement>(data.TitleAlt)),
                        "description": findElems(li.querySelectorAll<HTMLParagraphElement>(data.Content)),
                        "price": findElems(li.querySelectorAll<HTMLSpanElement>(data.Price))
                    }
                    var emptyArray = determineNestedArrayLength(foodobj);
                    var arrayFoodObjs : foodStrict[] | null = extractToArray(emptyArray, foodobj);
                    return arrayFoodObjs ? arrayFoodObjs : foodobj as foodStrict;
                });
            
            const hasObject : boolean = obj.some(s => s.title == title.innerHTML);  
            obj.push({ title: (hasObject ? 'Familie-' + title.innerHTML : title.innerHTML), content: food.flat() });
        });
        return obj;
    }, selectors);
};