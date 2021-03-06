
interface food {
    title : string;
    description : string | string[];
    price : number | number[];
}

interface foodStrict {
    title : string;
    description : string;
    price : number;
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
        var extractNumber = (val) => {
            var getNumber = (val) => Number(val.match(/\d+/)[0])
            if (Array.isArray(val)) {
                    return val.map(str => getNumber(str))
            }
            else return getNumber(val)
        }

        const findtitle  = (sel1 : HTMLSpanElement, sel2 : HTMLHeadingElement ) : string => (sel1 || sel2).innerHTML.trim();
        const findElems = (sel: NodeListOf<HTMLParagraphElement | HTMLSpanElement>) : string[] | string => {
            var xelem = Array.from(sel);
            return xelem.length > 1 ? xelem.map(el => el.innerHTML.trim()) : xelem[0].innerHTML.trim()
        }
        function determineNestedArrayLength (obj : food) : food[] | null {
            for (let f in obj) {
                if (Array.isArray(obj[f])) {
                    return Array(obj[f].length).fill(obj);
                }
            }
            return null;
        }
        function divideInArray (arr : food[]) : foodStrict[] { 
            return arr.map((food : food, index : number ) => {
                var clone : food = JSON.parse(JSON.stringify(food))
                for (let c in clone) {
                    clone[c] = Array.isArray(clone[c]) ? clone[c].filter((val : string, ind: number) => ind === index)[0] : clone[c]
                }
                return clone as foodStrict;
            }); 
        }

        Array.from(titles).forEach(title => {
            const food : (foodStrict | foodStrict[])[] = Array.from(title.nextElementSibling.nextElementSibling.getElementsByTagName("li"))
                .map((li) => {
                    
                    const foodobj : food =  {
                        "title": findtitle(li.querySelector<HTMLSpanElement>(data.Title), li.querySelector<HTMLHeadingElement>(data.TitleAlt)),
                        "description": findElems(li.querySelectorAll<HTMLParagraphElement>(data.Content)),
                        "price": extractNumber(findElems(li.querySelectorAll<HTMLSpanElement>(data.Price)))
                    }
                    var foodArray = determineNestedArrayLength(foodobj);
                    return foodArray ? divideInArray(foodArray) : foodobj as foodStrict;
                });
            
            const hasObject : boolean = obj.some(s => s.title == title.innerHTML.trim());  
            obj.push({ title: (hasObject ? 'Familie-' + title.innerHTML.trim() : title.innerHTML.trim()), content: food.flat() });
        });
        return obj;
    }, selectors);
};