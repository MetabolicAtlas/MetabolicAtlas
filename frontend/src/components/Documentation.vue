<template>
  <!-- eslint-disable max-len -->
  <section class="section extended-section">
    <div class="container is-fullhd">
      <h3 class="title is-3">Documentation</h3>
      <div class="columns is-variable is-8 pt-5">
        <TableOfContents :links="tocLinks" />
        <div id="documentation" class="column content has-text-justified">
          <p>
            Metabolic Atlas allows to visualization of the content of the integrated
            <a href="#integrated-models">Genome-scale metabolic models (GEMs)</a>
            by using the
            <a href="#gem-browser">GEM Browser</a>
            tool, and enables navigation of the metabolic network maps via the
            <a href="#map-viewer">Map viewer</a>
            tool. Moreover, interactions between metabolites and genes can be explored with the
            <a href="#interaction-partners">Interaction Partners</a>
            tool. These three tools are available upon selecting one of the integrated models. The
            selected model is indicated to the right of the Metabolic Atlas logo in the top
            navigation bar. Leaving the
            <i>Explore</i>
            section (or the
            <i>GEM Browser</i>
            /
            <i>Map Viewer</i>
            tools) will unselect the model, and remove its name from the navigation bar.
          </p>
          <p>
            To read more details about each of the integrated models, visit the
            <router-link :to="{ name: 'gems', hash: '#integrated-models' }">
              GEM Repository
            </router-link>
            page.
          </p>

          <hr class="mt-6" />
          <h4 id="gem-browser" class="is-info is-size-4">
            <span class="icon pr-5 is-large has-text-info"><i class="fa fa-table"></i></span>
            GEM Browser
          </h4>
          <p>
            The
            <i>GEM Browser</i>
            is a set of dedicated pages for various components, i.e., reactions, metabolites, genes,
            subsystems and compartments of the selected model, which is indicated on the left side
            of the top navigation bar. Each page contains a button on the right to
            <i>Report an issue</i>. Click this button to report a problem or ask questions to the
            modellers.
          </p>

          <h5 id="reaction-page" class="is-size-5">Reaction page</h5>
          <p>
            The
            <i>Reaction</i>
            page shows the information about the currently selected reaction. If provided by the
            modellers, a list of cross references to other models or databases and a list of
            references (PMIDs) are also shown in the
            <i>Cross references</i>
            and
            <i>References</i>
            tables respectively. On the right side of the page there is a list of links pointing to
            2D or 3D
            <a href="#map-viewer">Map Viewer</a>
            pages in which this reaction is involved.
          </p>

          <h5 id="gem-browser-metabolite" class="is-size-5">Metabolite page</h5>
          <p>
            The
            <i>Metabolite</i>
            page shows information of the currently selected metabolite. Metabolites in GEMs are
            often differentiated according to their cell compartment localization. For this reason,
            one metabolite, e.g. cholesterol, may correspond to several different metabolite entries
            in a GEM, such as cholesterol[c], cholesterol[m], with the suffix indicating the
            compartment in which the metabolite is localized.
          </p>
          <p>
            The top table of the page contains basic information extracted from the GEM. If provided
            by the modellers, a list of cross references to other models or databases will also be
            shown in the
            <i>Cross references</i>
            table under the top table.
          </p>
          <p>
            Below the
            <i>Cross references</i>
            table comes the
            <i>Reactions</i> table. It lists all reactions involving the current metabolite as a
            reactant or product. The current metabolite is highlighted in black in the reaction
            equations. This table can be exported by clicking the button <i>Export to TSV</i>. Since
            metabolites are specific to a cell compartment, only reactions involving the metabolite
            in its specific compartment are displayed. To remove this restriction and display
            additional reactions involving the metabolite in any compartment, click the button to
            <i>See reactions from all compartments</i>. Note that the number of retrieved reactions
            is limited to 1000. It is recommended to use the
            <a href="#api">API</a>
            to retrieve all reactions.
          </p>
          <p>
            On the top right of the page, the
            <a href="#interaction-partners">Interaction Partners</a>
            tool for that metabolite can be accessed by clicking the button
            <i>Interaction Partners</i>. Below this button there is a widget to access the
            corresponding 2D or 3D
            <a href="#map-viewer">Map Viewer</a>
            pages for this metabolite.
          </p>

          <h5 id="gene-page" class="is-size-5">Gene page</h5>
          <p>
            The layout of the Gene page is the same as the
            <a href="#gem-browser-metabolite">Metabolite</a>
            page except that the top table shows the information about the currently selected gene.
          </p>

          <h5 id="subsystem-page" class="is-size-5">Subsystem page</h5>
          <p>
            The layout of the
            <i>Subsystem</i>
            page is also similar to the
            <a href="#gem-browser-metabolite">Metabolite</a>
            page except that the top table shows information on the current selected metabolic
            subsystem instead of metabolites.
          </p>
          <p>
            Subsystems correspond to a set of reactions that share a similar metabolic function.
            Unlike a metabolic pathway, the reactions comprising a subsystem are not necessarily
            linked into a completely connected network.
          </p>
          <p>
            The lists of metabolites and genes contained within the current subsystem are shown in
            the top table, but are restricted to a maximum of 1000 for each category. Use the
            <a href="#api">API</a>
            to retrieve a complete set of metabolites and genes for the selected subsystem. Note
            that, in some GEMs, a given reaction can be associated with multiple subsystems.
          </p>

          <h5 id="compartment-page" class="is-size-5">Compartment page</h5>
          <p>
            The
            <i>Compartment</i>
            page shows the information of the currently selected compartment. It is only the number
            of metabolites, genes and reactions is shown in the top table. To retrieve a full list
            of metabolites, genes and reactions for a compartment, the use of the
            <a href="#api">API</a>
            is advised. Similarly to the
            <a href="#gem-browser-metabolite">Metabolite</a>
            page the list of links to the 2D or 3D Map Viewer pages where this compartment can be
            visualized is displayed on the right side of the page.
          </p>

          <hr class="mt-6" />
          <h4 id="map-viewer" class="is-size-4">
            <span class="icon pr-5 is-large has-text-info"><i class="fa fa-map-o"></i></span>
            Map Viewer
          </h4>
          <p>
            The
            <i>Map Viewer</i>
            is, similar to the
            <a href="#gem-browser">GEM Browser</a>, accessible after an integrated model has been
            selected. It includes a 2D viewer to visualise metabolic maps in SVG format, and a 3D
            viewer to explore the metabolic network in 3 dimensions. One can easily go back and
            forth between the
            <i>GEM Browser</i>
            and
            <i>Map Viewer</i>
            by clicking the button
            <i>GEM Browser</i>
            in the left sidebar of the
            <i>Map Viewer</i>
            page and links of the
            <i>Map Viewer</i>
            panel on the right side of the
            <i>GEM Browser</i>
            page, respectively.
          </p>
          <p>
            To switch between 2D maps and 3D networks, use the
            <i>Switch to 2D</i>
            or
            <i>Switch to 3D</i>
            button in the top left of the map, respectively. This button is disabled for a model
            without 2D maps, or when the corresponding 2D version of a 3D network is not available.
            One can select which compartment or subsystem to be shown in the viewer by clicking a
            corresponding item on the left sidebar.
          </p>

          <h5 id="2d-viewer" class="is-size-5">2D Viewer</h5>
          <p>
            The 2D maps in SVG format are provided for integrated GEMs. They represent either a cell
            compartment or a subsystem/pathway. While a very high percentage of the reactions in the
            model are represented on the 2D maps, some may be unavailable. SVG maps were produced
            with
            <a target="_blank" rel="noopener noreferrer" href="https://www.omix-visualization.com/"
              >Omix Visualisation</a
            >, a customizable tool for editing biochemical networks. A custom plug-in was developed
            to enable the creation of compact maps with consistent layout.
          </p>
          <p>
            All these 2D maps are manually curated to achieve state-of-the-art quality. However,
            this also makes it hard to keep these 2D maps up to date. As the integrated GEMs
            continuously update, the 2D maps and models are sometimes out of sync. Consequently,
            some reactions in the integrated GEMs for a certain compartment/subsystem might be
            missing from the corresponding 2D map. Occasionally, a 2D map can also include reactions
            which do not exist in the corresponding compartment/subsystem.
          </p>
          <p>
            There are five buttons on the top left of the map that allow to (from top to bottom)
            zoom in, zoom out, show/hide genes, show/hide subsystems, toggle fullscreen (exit the
            fullscreen mode with the key
            <i>Esc</i>
            ), and download the SVG map on the current view. One can interact with the map by
            clicking and dragging the mouse to pan the view or using the mouse wheel to zoom in/out.
          </p>
          <p>
            A search function is available for 2D maps using the search bar. The window will zoom
            and center on each component found. Click the
            <i>Highlight</i>
            button to color all found components on the maps in red. To remove the highlight, simply
            clear the search bar.
          </p>
          <p>
            The SVGs are interactive; click on a node (metabolite, reaction, gene) or a subsystem to
            load some of its information in the sidebar. Additional information on the corresponding
            selected element can be accessed by clicking the button "GEM browser" under information
            panel of the selected element on the left sidebar.
          </p>

          <h5 id="3d-viewer" class="is-size-5">3D Viewer</h5>
          <p>
            The 3D renderings of the metabolic network are automatically generated from the GEM
            data, with the help of
            <a
              href="https://github.com/MetabolicAtlas/3d-network-viewer"
              target="_blank"
              rel="noopener noreferrer"
            >
              a force-directed graph JavaScript library</a
            >. This 3D graph contains all the reactions in the model, grouped by cellular
            compartment or subsystem.
          </p>
          <p>
            There are six buttons on the top left of the 3D graph that allow one to (from top to
            bottom) zoom in, zoom out, show/hide genes and their connections, show/hide labels,
            toggle daylight/night mode, and toggle fullscreen (exit the fullscreen mode with the key
            <i>Esc</i>
            ).
          </p>
          <p>
            One can interact with the 3D graph using mouse by holding left-clicking button and
            moving the mouse to rotate the view, holding the right-clicking button and moving the
            mouse to pan, and scrolling the mouse wheel to zoom in/out.
          </p>
          <p>
            One can also hover a node to view its name/id or left-click on a node (once the graph
            has stopped moving) to display some of its information in the left sidebar. Additional
            information of the selected element can be accessed by clicking the button
            <i>GEM Browser</i>
            under the information panel of the selected element on the left sidebar.
          </p>
          <p>
            One can search for a specific item with id, name or alias by using the search bar on top
            of the 3D graph. The view will be zoomed in and centered on one of the found components,
            and the centered component will be highlighted in red square. In case there are more
            than one found components, one can change the view to each found component by clicking
            the left/right buttons on the right side of the search bar. When changing to the next
            found component, the view will be re-centered to the new component.
          </p>
          <p>
            Similar to the 2D SVG maps, the 3D graphs are interactive. Clicking a node on the 3D
            graph, be it a metabolite, reaction, or gene, the information panel on the left sidebar
            will be updated for the clicked node. Additional information of the selected node can be
            accessed by clicking the button "GEM Browser" under information panel on the left
            sidebar.
          </p>

          <h5 id="data-overlay" class="is-size-5">Data overlay</h5>
          <div class="columns ml-0">
            <div class="column pl-0 is-8 content">
              <p>
                The
                <i>Data overlay</i> feature enables overlay of scaled values onto genes, reactions,
                and metabolites. These values can come from different sources, such as
                transcriptomics analyses, or can be entirely computed, such as the reaction
                presence. The
                <i>Data overlay</i>
                panel is by default hidden in the
                <i>Map Viewer</i>. By clicking the
                <i>Data overlay</i>
                button on the right side of the page, one can toggle the hidden/display of this
                panel. For Human-GEM, the gene expression levels and reaction data from
                <a href="https://www.proteinatlas.org/" target="_blank" rel="noopener noreferrer"
                  >The Human Protein Atlas</a
                >
                can be loaded by selecting one of the tissues in the drop down list. Once selected,
                the levels corresponding to the chosen tissue will be used to color corresponding
                components on the respective map, according to the color legend (an example of the
                color legend is shown
                <b>Figure 1</b>
                ). To clear the levels, select the
                <i>None</i>
                option in the drop down list or alternatively remove the corresponding card if
                levels from multiple data types are applied. Levels are available for both 2D and 3D
                Map Viewer. The gene expression levels used are obtained from the
                <a
                  href="https://www.proteinatlas.org/about/download"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  download page
                </a>
                of the Human Protein Atlas.
              </p>
              <p>
                The reaction presence was initially computed as a number between 0 and 100. The
                value is computed by creating bootstraps from the single-cell RNA-Seq data from the
                <a
                  href="https://www.proteinatlas.org/about/releases#21.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Human Protein Atlas - Single Cell Type Section</a
                >, pooling those into RNA-Seq profiles and applying the ftINIT algorithm. A high
                value &#8805;0.99 means that there is high confidence that the reaction is present,
                whereas a low value &#8804;0.01 means it is not. The resulting values were then
                scaled to 0-1 as per
                <a
                  href="https://github.com/MetabolicAtlas/data-files/blob/main/DATA_OVERLAY.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  >these guidelines</a
                >. For more information on single-cell bootstraps and how ftINIT works, please see
                <a
                  href="https://www.biorxiv.org/content/10.1101/2022.04.25.489379v1.full"
                  target="_blank"
                  rel="noopener noreferrer"
                  >this manuscript</a
                >.
              </p>
              <p>
                The
                <i>Data overlay</i>
                sidebar also allows uploading of custom data in
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://en.wikipedia.org/wiki/Tab-separated_values"
                >
                  TSV format</a
                >. The custom data file should contain at least two columns with headers and use tab
                delimiter. The first column has to contain model IDs for genes, reactions or
                metabolites. model. The header of the first column should be named as
                <b>id</b>
                as shown in the example to the right (
                <b>Figure 2</b>
                ). Any missing genes or missing values will be assigned an "n/a" value and
                highlighted in gray. The rest of the columns act as data series, with each column
                being a new data series (see
                <b>Figure 2</b>
                ). Note that the values of data series must be in the range of 0-1. Detailed
                information about the format of the custom data as well as why the data should be in
                the rage of 0-1 can be found
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/MetabolicAtlas/data-files/blob/main/DATA_OVERLAY.md#data-source-file-requirements"
                >
                  here</a
                >. The headers of these data series will be shown automatically in the dropdown
                options for the uploaded data. The values are expected in TPM.
              </p>
            </div>
            <div class="column">
              <RNALegend></RNALegend>
              <p style="font-size: 80%">
                <b>
                  Figure 1: Color legend for RNA level in Data overlay when only one data is
                  selected.
                </b>
              </p>

              <blockquote class="mt-6">
                <span class="is-block">id&emsp;heart&emsp;liver</span>
                <span class="is-block">ENSG00000177666&emsp;0.484&emsp;0.349</span>
                <span class="is-block">ENSG00000175535&emsp;0.564&emsp;0</span>
                <span class="is-block">ENSG00000187021&emsp;0.114&emsp;0</span>
              </blockquote>
              <p style="font-size: 80%">
                <b>Figure 2: Example file for custom data to be uploaded in Data overlay</b>
              </p>
            </div>
          </div>

          <hr class="mt-6" />
          <h4 id="interaction-partners" class="is-size-4">
            <span class="icon pr-5 is-large has-text-info">
              <i class="fa fa-connectdevelop"></i>
            </span>
            Interaction Partners
          </h4>
          <div id="interaction-partners-intro">
            <figure id="interaction-partners-figure">
              <img src="/assets/interPart.jpg" alt="interaction partners example" />
              <figcaption>Example of the Interaction Partners tool</figcaption>
            </figure>
            <p>
              For a given metabolite or gene, this tool (shown in the figure to the right) renders a
              connected graph of the other metabolites and genes that it interacts with via shared
              reaction(s). The metabolite or gene of interest is centered on the graph. An edge
              between two nodes represent a connection that occurs via one or multiple reactions.
            </p>
            <p class="mt-5">
              Clicking/selecting a node (shown as a red coloured node) shows links on the right
              sidebar. There are two options; to reload the
              <i>Interaction Partners</i>
              for that node, or to navigate to the corresponding
              <a href="#gem-browser">GEM Browser</a>
              page and to expand the graph.
            </p>
            <p>
              The top-left buttons on the graph allow one to (from left to right): zoom in, zoom out
              and hide node labels. One may also use the mouse to pan the graph by holding the left
              mouse button and dragging, and zoom by scrolling the mouse wheel.
              <!-- add these:
            reset the display, reload the graph (remove
            expanded interaction partners), and remove any highlighting.-->
            </p>
          </div>
          <h5 id="interaction-partners-expand" class="is-size-5">Expand and color the graph</h5>
          <p>
            One can right-click a node to display a context menu with the option
            <i>Expand interaction partners</i>. This will add additional interaction partner nodes
            for the clicked node to the graph.
          </p>
          <p>
            Similar to the <a href="#map-viewer">Map Viewer</a>, one can also add a
            <a href="#data-overlay">Data Overlay</a> to the <i>Interaction Partners</i> network to
            color the nodes based on the expression data selected.
          </p>
          <p>
            Graphs with overlay and extended nodes can be shared by the url in the address bar, that
            is, one will get the same graph with overlaid data when opening the shared url at
            another computer. However, if custom data has been uploaded and used for the overlay, it
            can not be shared through the url.
          </p>

          <h5 id="interaction-partners-export" class="is-size-5">Export the graph</h5>
          The graph of
          <i>Interaction Partners</i>
          can be exported by clicking the top-right button
          <i>Export</i>. There are two options for graph exporting: GraphML or PNG. GraphML is a
          Cytoscape compatible format. Currently, color format is not supported for the GraphML
          option, but you may color the graph by editing the exported GraphML image in Cytoscape.

          <h5 id="interaction-partners-reactions" class="is-size-5">Reactions table</h5>
          <p>
            Information about the reactions of the network is show in the
            <i>Reactions</i>
            table, which is located on the lower part of the page. The search bar above the table
            can be used to filter out rows to find a given component. This table can be exported by
            clicking the button
            <i>Export to TSV</i>.
          </p>

          <hr class="mt-6" />
          <h4 id="searching" class="is-size-4">
            <span class="icon pr-5 is-large has-text-info"><i class="fa fa-search"></i></span>
            Search
          </h4>
          <p>
            For convenience, Metabolic Atlas provides two ways of searching:
            <i>Quick search</i>
            and
            <i>Global search</i>. One can search for any terms in metabolites, genes, reactions,
            subsystems or compartments information with both searching methods. In addition,
            proximity searching is enabled so that the searching algorithm will not only search for
            exact matching of the input keywords but also try to find hits that are similar to the
            input keywords.
          </p>

          <h5 id="quick-search" class="is-size-5">Quick search</h5>
          <p>
            By clicking the icon
            <span><i class="fa fa-search"></i></span>
            in the top navigation bar, one can perform a quick search of any terms in metabolites,
            genes, reactions, subsystems or compartments. The found hits will be shown directly
            under the searching bar if there is any or prompted with
            <i>No matches</i>. The results links redirect to the corresponding
            <i>GEM Browser</i>
            page of the component clicked. One can also click the icon
            <span><i class="fa fa-table"></i></span>
            or
            <span><i class="fa fa-connectdevelop"></i></span>
            to the left of each found hit to redirect to the
            <i>Metabolite</i>
            page or
            <i>Interaction Parters</i>
            page respectively.
          </p>
          <p>
            The
            <i>Quick search</i>
            is restricted to the selected GEM on the left side of searching bar and limited to 10
            results per component type. Alternatively, one can click on the banner under the search
            input field to run a
            <i>Global Search</i>, where the term is searched among all the integrated models'
            components and is unrestricted. To learn more about the search term possibilities, go to
            the
            <a href="#global-search">Global Search</a>
            section of this page.
          </p>

          <h5 id="global-search" class="is-size-5">Global search</h5>
          <p>
            The
            <i>Global search</i>
            page queries all the integrated metabolic models. Each metabolic component has its own
            results table accessible via the dedicated tab. Tabs are inactivated when no results are
            found. The search text is not restricted to the visible columns; for example, searching
            an MetaNetX ID will return results for the metabolites and/or reactions matching the ID
            even though the MetaNetX column is not in the table. The search algorithm matches
            partial names of components: searching for 'cholesterol' will output all metabolites
            containing the substring 'cholesterol'. When the name of a metabolite is provided, all
            metabolites matching or partially matching this name be returned, in addition to a the
            list of all reactions that involve these matching metabolites.
          </p>

          <hr class="mt-6" />
          <h4 id="gem" class="is-size-4">
            <span class="icon pr-5 is-large has-text-info"><i class="fa fa-files-o"></i></span>
            GEM
          </h4>
          <p>
            A genome-scale metabolic model (GEM) is a mathematical representation of a metabolic
            reaction network.
          </p>

          <h5 id="integrated-models" class="is-size-5">Integrated GEMs</h5>
          <p>
            Currently, Metabolic Atlas contains seven integrated models, i.e.,
            <i>Fruitfly-GEM</i>, <i>Human-GEM</i>, <i>Mouse-GEM</i>, <i>Rat-GEM</i>,
            <i>Worm-GEM</i>,
            <i>Yeast-GEM</i>
            and
            <i>Zebrafish-GEM</i>. Details can be found at the
            <router-link :to="{ name: 'gems', hash: '#integrated-models' }">
              GEM Repository
            </router-link>
            page.
          </p>

          <h5 id="repository" class="is-size-5">GEM Repository</h5>
          <p>
            The repository lists all models constructed by the SysBio research group; this includes
            older models that may no longer be maintained (for example HMR 2.0), and others that
            were recently published. The more recent GEMs can also be found in the
            <a
              href="https://www.github.com/SysBioChalmers/"
              target="_blank"
              rel="noopener noreferrer"
            >
              SysBioChalmers organization GitHub</a
            >.
          </p>
          <p>
            Click on a row in the table to show more information about a GEM. One can download
            models in various file formats (when available).
          </p>

          <h5 id="comparison" class="is-size-5">Comparison</h5>
          <p>
            In the first section of the page one can select 2 or 3 integrated GEMs to compare. The
            comparison is performed dynamically, by inspecting the cross references to other models
            or databases they share in the database. If a reaction or a metabolite share at least
            one such cross reference, they are considered to be shared between the compared models.
            Otherwise, they are considered to be unique to the respective model. The comparison
            table is interactive - by clicking on a cell, the corresponding comparison details are
            shown on the right panel.
          </p>
          <p>
            In the second section, the
            <i>Comparison</i>
            page provides statistics about the comparison/overlap between Human-GEM 1.0.2 and HMR
            2.0, as well as Human-GEM and Recon3D. This comparison has been performed manually for
            an early version of Human-GEM, and will not be updated.
          </p>

          <h5 id="ftp-access" class="is-size-5">FTP access</h5>
          <p>
            Genome-Scale Metabolic model files can be downloaded from
            <a :href="`ftp://${ftpUrl}/`">ftp://{{ ftpUrl }}</a>
            or by connecting to the FTP using your favourite FTP client (e.g.
            <a href="https://filezilla-project.org/">FileZilla</a>
            ).
          </p>
          <span class="is-block">
            <span class="has-text-weight-bold lab">Host:</span>
            <a :href="`ftp://${ftpUrl}/`">ftp://{{ ftpUrl }}</a>
          </span>
          <span class="is-block">
            <span class="has-text-weight-bold lab">Login:</span>
            leave blank
          </span>
          <span class="is-block">
            <span class="has-text-weight-bold lab">Password:</span>
            leave blank
          </span>
          <span class="is-block">
            <span class="has-text-weight-bold lab">Port:</span>
            21
          </span>

          <hr class="mt-6" />
          <h4 id="resources" class="is-size-4">
            <span class="icon pr-5 is-large has-text-info"><i class="fa fa-cogs"></i></span>
            Resources
          </h4>
          <h5 id="api" class="is-size-5">API</h5>
          <p>
            Metabolic Atlas has a
            <a href="/api" target="_blank" rel="noopener noreferrer">
              dedicated interface to facilitate the use of the API</a
            >, with output provided in JSON format. The API lets you retrieve data from the
            integrated models of Metabolic Atlas (eg. genes, metabolites, maps...) as well as the
            <a href="/gotenzymes">GotEnzymes database</a>.
          </p>
          <p>
            When using this service, kindly use a limit of 10 requests per second. The API is still
            undergoing development; while it covers the entire content of the models, it might
            change without prior notice.
          </p>
          <h5 id="registry-links" class="is-size-5">Registry links</h5>
          <p>
            Metabolic Atlas is associated with other widely used registry services such as
            <a target="_blank" rel="noopener noreferrer" href="https://identifiers.org">
              Identifiers.org</a
            >
            and
            <a target="_blank" rel="noopener noreferrer" href="https://bioregistry.io">
              Bioregistry</a
            >. For example, when visiting the Identifiers.org url
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://identifiers.org/metatlas:MAR11760"
            >
              https://identifiers.org/metatlas:MAR11760</a
            >
            or the Bioregistry url
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://bioregistry.io/metatlas:MAR11760"
            >
              https://bioregistry.io/metatlas:MAR11760</a
            >, you will be directed to the same dedicated page at Metabolic Atlas.
          </p>
          <h5 id="related-resources" class="is-size-5">Related resources</h5>
          <p>
            Metabolic Atlas is associated with other software tools, algorithms, and databases
            published by the SysBio group. Visit the
            <a href="/about/resources/"> about page section</a> to browse the lists.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import RNALegend from '@/components/explorer/mapViewer/RNALegend.vue';
import TableOfContents from '@/components/shared/TableOfContents.vue';

export default {
  name: 'Help',
  components: {
    RNALegend,
    TableOfContents,
  },
  data() {
    return {
      ftpUrl: 'ftp.metabolicatlas.org',
      tocLinks: [
        {
          name: 'GEM Browser',
          icon: 'fa-table',
          link: '#gem-browser',
          subsections: [
            { name: 'Reaction page', link: '#reaction-page' },
            { name: 'Metabolite page', link: '#gem-browser-metabolite' },
            { name: 'Gene page', link: '#gene-page' },
            { name: 'Subsystem page', link: '#subsystem-page' },
            { name: 'Compartment page', link: '#compartment-page' },
          ],
        },
        {
          name: 'Map Viewer',
          icon: 'fa-map-o',
          link: '#map-viewer',
          subsections: [
            { name: '2D Viewer', link: '#2d-viewer' },
            { name: '3D Viewer', link: '#3d-viewer' },
            { name: 'Data Overlay', link: '#data-overlay' },
          ],
        },
        {
          name: 'Interaction Partners',
          icon: 'fa-connectdevelop',
          link: '#interaction-partners',
          subsections: [
            { name: 'Expand and color the graph', link: '#interaction-partners-expand' },
            { name: 'Export the graph', link: '#interaction-partners-export' },
            { name: 'Reactions table', link: '#interaction-partners-reactions' },
          ],
        },
        {
          name: 'Search',
          icon: 'fa-search',
          link: '#searching',
          subsections: [
            { name: 'Quick search', link: '#quick-search' },
            { name: 'Global search', link: '#global-search' },
          ],
        },
        {
          name: 'GEM',
          icon: 'fa-files-o',
          link: '#gem',
          subsections: [
            { name: 'Integrated models', link: '#integrated-models' },
            { name: 'Repository', link: '#repository' },
            { name: 'Comparison', link: '#comparison' },
            { name: 'FTP access', link: '#ftp-access' },
          ],
        },
        {
          name: 'Resources',
          icon: 'fa-cogs',
          link: '#resources',
          subsections: [
            { name: 'API', link: '#api' },
            { name: 'Registry links', link: '#registry-links' },
            { name: 'Related resources', link: '#related-resources' },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
#interaction-partners-intro {
  display: flex;
  flex-direction: column-reverse;
}

#interaction-partners-figure {
  margin: 1rem 0;

  figcaption {
    font-size: 80%;
    font-weight: bold;
    font-style: normal;
  }
}

@media screen and (min-width: $tablet) {
  #interaction-partners-intro {
    display: block;
  }

  #interaction-partners-figure {
    float: right;
    width: 50%;
    margin: 0 0 1rem 1.5rem;
  }
}
</style>
