/*
 * The MIT License
 * 
 * Copyright (c) 2004-2009, Sun Microsystems, Inc., Kohsuke Kawaguchi, Yahoo! Inc.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package lib.form;

import static com.gargoylesoftware.htmlunit.HttpMethod.POST;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;

import com.gargoylesoftware.htmlunit.Page;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlButton;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlElementUtil;
import com.gargoylesoftware.htmlunit.html.HtmlInput;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import edu.umd.cs.findbugs.annotations.CheckForNull;
import hudson.model.FreeStyleProject;
import hudson.model.Job;
import hudson.model.UnprotectedRootAction;
import hudson.util.HttpResponses;
import jenkins.model.OptionalJobProperty;
import org.junit.Rule;
import org.junit.Test;
import org.jvnet.hudson.test.Issue;
import org.jvnet.hudson.test.JenkinsRule;
import org.jvnet.hudson.test.TestExtension;
import org.kohsuke.stapler.HttpResponse;
import org.kohsuke.stapler.StaplerRequest;
import org.kohsuke.stapler.WebMethod;
import org.w3c.dom.NodeList;

/**
 * @author Kohsuke Kawaguchi
 */
public class ExpandableTextboxTest {
    @Rule
    public JenkinsRule j = new JenkinsRule();
    
    @Issue("JENKINS-2816")
    @Test
    public void testMultiline() throws Exception {
        // because attribute values are normalized, it's not very easy to encode multi-line string as @value. So let's use the system message here.
        j.jenkins.setSystemMessage("foo\nbar\nzot");
        HtmlPage page = evaluateAsHtml("<l:layout><l:main-panel><table><j:set var='instance' value='${it}'/><f:expandableTextbox field='systemMessage' /></table></l:main-panel></l:layout>");
        // System.out.println(page.getWebResponse().getContentAsString());

        NodeList textareas = page.getElementsByTagName("textarea");
        assertEquals(1, textareas.getLength());
        assertEquals(j.jenkins.getSystemMessage(),textareas.item(0).getTextContent());
    }

    /**
     * Evaluates the literal Jelly script passed as a parameter as HTML and returns the page.
     */
    protected HtmlPage evaluateAsHtml(String jellyScript) throws Exception {
        JenkinsRule.WebClient wc = j.createWebClient();
        WebRequest req = new WebRequest(wc.createCrumbedUrl("eval"), POST);
        req.setEncodingType(null);
        req.setRequestBody("<j:jelly xmlns:j='jelly:core' xmlns:st='jelly:stapler' xmlns:l='/lib/layout' xmlns:f='/lib/form'>"+jellyScript+"</j:jelly>");
        Page page = wc.getPage(req);
        return (HtmlPage) page;
    }
    
    @Test
    public void noInjectionArePossible() throws Exception {
        TestRootAction testParams = j.jenkins.getExtensionList(UnprotectedRootAction.class).get(TestRootAction.class);
        assertNotNull(testParams);
    
        checkRegularCase(testParams);
        checkInjectionInName(testParams);
    }
    
    private void checkRegularCase(TestRootAction testParams) throws Exception {
        testParams.paramName = "testName";
        
        JenkinsRule.WebClient wc = j.createWebClient()
                .withThrowExceptionOnFailingStatusCode(false);
        HtmlPage p = wc.goTo("test");
        
        HtmlElementUtil.click(getExpandButton(p));
        assertNotEquals("hacked", p.getTitleText());
    }
    
    private void checkInjectionInName(TestRootAction testParams) throws Exception {
        testParams.paramName = "testName',document.title='hacked'+'";
        
        JenkinsRule.WebClient wc = j.createWebClient()
                .withThrowExceptionOnFailingStatusCode(false);
        HtmlPage p = wc.goTo("test");
        
        HtmlElementUtil.click(getExpandButton(p));
        assertNotEquals("hacked", p.getTitleText());
    }
    
    private HtmlButton getExpandButton(HtmlPage page){
        DomNodeList<HtmlElement> buttons = page.getElementById("test-panel").getElementsByTagName("button");
        // the first one is the text input
        assertEquals(1, buttons.size());
        return (HtmlButton) buttons.get(0);
    }
    
    @TestExtension("noInjectionArePossible")
    public static final class TestRootAction implements UnprotectedRootAction {
        
        public String paramName;
        
        @Override
        public @CheckForNull String getIconFileName() {
            return null;
        }
        
        @Override
        public @CheckForNull String getDisplayName() {
            return null;
        }
        
        @Override
        public String getUrlName() {
            return "test";
        }
        
        @WebMethod(name = "submit")
        public HttpResponse doSubmit(StaplerRequest request) {
            return HttpResponses.text("method:" + request.getMethod());
        }
    }

    @Test
    @Issue("SECURITY-1498")
    public void noXssUsingInputValue() throws Exception {
        XssProperty xssProperty = new XssProperty("</textarea><h1>HACK</h1>");
        FreeStyleProject p = j.createFreeStyleProject();
        p.addProperty(xssProperty);

        JenkinsRule.WebClient wc = j.createWebClient();
        HtmlPage configurePage = wc.getPage(p, "configure");

        int numberOfH1Before = configurePage.getElementsByTagName("h1").size();

        HtmlInput xssInput = configurePage.getElementByName("_.xss");
        HtmlElement expandButton = (HtmlElement) xssInput.getParentNode().getNextSibling().getFirstChild();
        HtmlElementUtil.click(expandButton);

        // no additional h1, meaning the "payload" is not interpreted
        int numberOfH1After = configurePage.getElementsByTagName("h1").size();

        assertEquals(numberOfH1Before, numberOfH1After);
    }

    public static final class XssProperty extends OptionalJobProperty<Job<?,?>> {

        private String xss;

        public XssProperty(String xss){
            this.xss = xss;
        }

        public String getXss() {
            return xss;
        }

        @TestExtension("noXssUsingInputValue")
        public static class DescriptorImpl extends OptionalJobProperty.OptionalJobPropertyDescriptor {
        }
    }
}
