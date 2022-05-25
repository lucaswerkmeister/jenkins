/*
 * The MIT License
 *
 * Copyright (c) 2015, CloudBees, Inc.
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

package jenkins;

import hudson.Extension;
import hudson.model.RootAction;
import hudson.util.HttpResponses;
import net.sf.json.JSONObject;
import org.jenkins.ui.icon.IconSet;
import org.kohsuke.accmod.Restricted;
import org.kohsuke.accmod.restrictions.NoExternalUse;
import org.kohsuke.stapler.HttpResponse;
import org.kohsuke.stapler.StaplerRequest;

import java.util.Locale;

import static hudson.Functions.extractPluginNameFromIconSrc;

/**
 * Internationalization REST (ish) API.
 * @author <a href="mailto:tom.fennelly@gmail.com">tom.fennelly@gmail.com</a>
 * @since 2.0
 */
@Extension
@Restricted(NoExternalUse.class)
public class Symbols implements RootAction {

    @Override
    public String getIconFileName() {
        return null;
    }

    @Override
    public String getDisplayName() {
        return null;
    }

    @Override
    public String getUrlName() {
        return "symbols";
    }

    /**
     * Get a localised resource bundle.
     * <p>
     * URL: {@code i18n/resourceBundle}.
     * <p>
     * Parameters:
     * <ul>
     *     <li>{@code baseName}: The resource bundle base name.</li>
     *     <li>{@code language}: {@link Locale} Language. (optional)</li>
     *     <li>{@code country}: {@link Locale} Country. (optional)</li>
     *     <li>{@code variant}: {@link Locale} Language variant. (optional)</li>
     * </ul>
     *
     * @param request The request.
     * @return The JSON response.
     */
    public HttpResponse doIndex(StaplerRequest request) {
        String symbol = request.getParameter("symbol");

        if (symbol == null) {
            return HttpResponses.errorJSON("Mandatory parameter 'symbol' not specified.");
        }

        symbol = symbol.replace("symbol-", "");

//        String title = request.getParameter("title");
//        String tooltip = request.getParameter("tooltip");
//        String classes = request.getParameter("classes");
//        String pluginName = extractPluginNameFromIconSrc(symbol);
//        String id = request.getParameter("id");

        String title = "";
        String tooltip = "";
        String classes = "";
        String pluginName = extractPluginNameFromIconSrc(symbol);
        String id = "";

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("symbol", IconSet.getSymbol(symbol, title, tooltip, classes, pluginName, id));

        return HttpResponses.okJSON(jsonObject);
    }
}
