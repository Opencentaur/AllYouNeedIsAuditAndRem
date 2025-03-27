import { ITest } from "../test-type/itest";
import { TestStep } from "../test-type/test-step";
import { TestStepResult } from "../test-type/test-step-result";
import { getCurrentTab } from "../utils/get-current-tab";

export class CookieAudit implements ITest {
    id: string = "CookieAudit";
    name: string ="CookieAudit";
    description: string = "Vérifier si des cookies sont stockés sans Secure, HttpOnly ou SameSite=Strict, ce qui peut les exposer à des attaques.";
    
    currentCookiesList: chrome.cookies.Cookie[] = [];
    
    configuration: TestStep[] = [
        {
            id: 0,
            name: "Get list of cookies",
        description: "This step will get the list of cookies",
    },
    {
        id: 1,
        name: "Check for insecure cookies",
        description: "This step will check for insecure cookies without Secure, HttpOnly or SameSite=Strict",
    },
    {
        id: 2,
    name: "List insecure cookies",
    description: "This step will list the insecure cookies identified",
}
    ];
    
    

    // TODO Remediation "in code" : affichage simple avec step by step
   
   async getcookieslist(): Promise<TestStepResult> {

    const tab = await getCurrentTab()
    if (!tab?.id) {
        return {
            nextStepId: 0,
            result: 'error',
            additionalInformation: 'Could not find current tab.'
        }
    }


    console.log("test v4");


    const scriptResult = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: "MAIN",
        func: () => {
            
            return ((window as any).document.cookie);
        }
    });

    if (!scriptResult || !scriptResult[0]) {
        return {
            nextStepId: 0,
            result: 'error',
            additionalInformation: 'Could execute script on tab.'
        }
    }

    console.log("test v4 1", scriptResult);
    console.log("🍪 Cookies récupérés :", scriptResult);

    this.currentCookiesList = scriptResult[0].result as chrome.cookies.Cookie[];

      


    if (this.currentCookiesList.length===0) {
        return {
            nextStepId: 0,
            result: 'success',
            additionalInformation: 'No cookies found.'
        }
    }

    console.log("test v4 222", this.currentCookiesList);


    this.currentCookiesList.forEach((cookie) => {
        console.log("cookie détecté :", `${cookie.name}" = "${cookie.value}"`);
      });

      return {
        nextStepId: 1,
        result: 'setup',
        
    }


    }



    checkforinsecurecookies(): Promise<TestStepResult> {
        throw new Error("Method not implemented.");
    }
    displaylistinsecurecookies(): Promise<TestStepResult> {
        throw new Error("Method not implemented.");
    }

    runTestStep(stepId: number): Promise<TestStepResult> {

        
        if (stepId === 0) {
            return this.getcookieslist();
        }
        if (stepId === 1) {
            return this.checkforinsecurecookies();
        }
        if (stepId === 2) {
            return this.displaylistinsecurecookies();
        }
        throw new Error("Method not implemented.");
    }
}
