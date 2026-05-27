window.XpotSamples = [
    {
        id: "cd-catalog",
        label: "CD Catalog",
        defaultXPath: "//CD[ARTIST[contains(text(), 'Bob Dylan')]]/TITLE/text()",
        examples: [
            "//CD/TITLE/text()",
            "//ARTIST[contains(text(), 'Bob Dylan')]",
            "//CD[ARTIST[contains(text(), 'Bob Dylan')]]/TITLE/text()",
            "//ARTIST[contains(text(), 'Bob Dylan')]/../TITLE/text()",
            "//CD[COUNTRY='UK']/TITLE/text()",
            "//CD[PRICE > 10]/TITLE/text()",
            "//CD[COMPANY='Columbia']/ARTIST/text()",
            "//TITLE[contains(text(), 'Greatest')]/../ARTIST/text()",
            "//YEAR[text()='1990']/../TITLE/text()",
            "//COUNTRY[text()='USA']/../TITLE/text()",
            "count(//CD[COUNTRY='UK'])",
            "count(//CD[ARTIST[contains(text(), 'Bob Dylan')]])"
        ],
        xml: `<?xml version="1.0" encoding="UTF-8"?>
<CATALOG>
  <CD>
    <TITLE>Empire Burlesque</TITLE>
    <ARTIST>Bob Dylan</ARTIST>
    <COUNTRY>USA</COUNTRY>
    <COMPANY>Columbia</COMPANY>
    <PRICE>10.90</PRICE>
    <YEAR>1985</YEAR>
  </CD>
  <CD>
    <TITLE>Hide your heart</TITLE>
    <ARTIST>Bonnie Tyler</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>CBS Records</COMPANY>
    <PRICE>9.90</PRICE>
    <YEAR>1988</YEAR>
  </CD>
  <CD>
    <TITLE>Greatest Hits</TITLE>
    <ARTIST>Dolly Parton</ARTIST>
    <COUNTRY>USA</COUNTRY>
    <COMPANY>RCA</COMPANY>
    <PRICE>9.90</PRICE>
    <YEAR>1982</YEAR>
  </CD>
  <CD>
    <TITLE>Still got the blues</TITLE>
    <ARTIST>Gary Moore</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>Virgin records</COMPANY>
    <PRICE>10.20</PRICE>
    <YEAR>1990</YEAR>
  </CD>
  <CD>
    <TITLE>Eros</TITLE>
    <ARTIST>Eros Ramazzotti</ARTIST>
    <COUNTRY>EU</COUNTRY>
    <COMPANY>BMG</COMPANY>
    <PRICE>9.90</PRICE>
    <YEAR>1997</YEAR>
  </CD>
  <CD>
    <TITLE>One night only</TITLE>
    <ARTIST>Bee Gees</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>Polydor</COMPANY>
    <PRICE>10.90</PRICE>
    <YEAR>1998</YEAR>
  </CD>
  <CD>
    <TITLE>Sylvias Mother</TITLE>
    <ARTIST>Dr.Hook</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>CBS</COMPANY>
    <PRICE>8.10</PRICE>
    <YEAR>1973</YEAR>
  </CD>
  <CD>
    <TITLE>Maggie May</TITLE>
    <ARTIST>Rod Stewart</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>Pickwick</COMPANY>
    <PRICE>8.50</PRICE>
    <YEAR>1990</YEAR>
  </CD>
  <CD>
    <TITLE>Romanza</TITLE>
    <ARTIST>Andrea Bocelli</ARTIST>
    <COUNTRY>EU</COUNTRY>
    <COMPANY>Polydor</COMPANY>
    <PRICE>10.80</PRICE>
    <YEAR>1996</YEAR>
  </CD>
  <CD>
    <TITLE>When a man loves a woman</TITLE>
    <ARTIST>Percy Sledge</ARTIST>
    <COUNTRY>USA</COUNTRY>
    <COMPANY>Atlantic</COMPANY>
    <PRICE>8.70</PRICE>
    <YEAR>1987</YEAR>
  </CD>
  <CD>
    <TITLE>Black angel</TITLE>
    <ARTIST>Savage Rose</ARTIST>
    <COUNTRY>EU</COUNTRY>
    <COMPANY>Mega</COMPANY>
    <PRICE>10.90</PRICE>
    <YEAR>1995</YEAR>
  </CD>
  <CD>
    <TITLE>1999 Grammy Nominees</TITLE>
    <ARTIST>Many</ARTIST>
    <COUNTRY>USA</COUNTRY>
    <COMPANY>Grammy</COMPANY>
    <PRICE>10.20</PRICE>
    <YEAR>1999</YEAR>
  </CD>
  <CD>
    <TITLE>For the good times</TITLE>
    <ARTIST>Kenny Rogers</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>Mucik Master</COMPANY>
    <PRICE>8.70</PRICE>
    <YEAR>1995</YEAR>
  </CD>
  <CD>
    <TITLE>Big Willie style</TITLE>
    <ARTIST>Will Smith</ARTIST>
    <COUNTRY>USA</COUNTRY>
    <COMPANY>Columbia</COMPANY>
    <PRICE>9.90</PRICE>
    <YEAR>1997</YEAR>
  </CD>
  <CD>
    <TITLE>Tupelo Honey</TITLE>
    <ARTIST>Van Morrison</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>Polydor</COMPANY>
    <PRICE>8.20</PRICE>
    <YEAR>1971</YEAR>
  </CD>
  <CD>
    <TITLE>Soulsville</TITLE>
    <ARTIST>Jorn Hoel</ARTIST>
    <COUNTRY>Norway</COUNTRY>
    <COMPANY>WEA</COMPANY>
    <PRICE>7.90</PRICE>
    <YEAR>1996</YEAR>
  </CD>
  <CD>
    <TITLE>The very best of</TITLE>
    <ARTIST>Cat Stevens</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>Island</COMPANY>
    <PRICE>8.90</PRICE>
    <YEAR>1990</YEAR>
  </CD>
  <CD>
    <TITLE>Stop</TITLE>
    <ARTIST>Sam Brown</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>A and M</COMPANY>
    <PRICE>8.90</PRICE>
    <YEAR>1988</YEAR>
  </CD>
  <CD>
    <TITLE>Bridge of Spies</TITLE>
    <ARTIST>T'Pau</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>Siren</COMPANY>
    <PRICE>7.90</PRICE>
    <YEAR>1987</YEAR>
  </CD>
  <CD>
    <TITLE>Private Dancer</TITLE>
    <ARTIST>Tina Turner</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>Capitol</COMPANY>
    <PRICE>8.90</PRICE>
    <YEAR>1983</YEAR>
  </CD>
  <CD>
    <TITLE>Midt om natten</TITLE>
    <ARTIST>Kim Larsen</ARTIST>
    <COUNTRY>EU</COUNTRY>
    <COMPANY>Medley</COMPANY>
    <PRICE>7.80</PRICE>
    <YEAR>1983</YEAR>
  </CD>
  <CD>
    <TITLE>Pavarotti Gala Concert</TITLE>
    <ARTIST>Luciano Pavarotti</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>DECCA</COMPANY>
    <PRICE>9.90</PRICE>
    <YEAR>1991</YEAR>
  </CD>
  <CD>
    <TITLE>The dock of the bay</TITLE>
    <ARTIST>Otis Redding</ARTIST>
    <COUNTRY>USA</COUNTRY>
    <COMPANY>Stax Records</COMPANY>
    <PRICE>7.90</PRICE>
    <YEAR>1968</YEAR>
  </CD>
  <CD>
    <TITLE>Picture book</TITLE>
    <ARTIST>Simply Red</ARTIST>
    <COUNTRY>EU</COUNTRY>
    <COMPANY>Elektra</COMPANY>
    <PRICE>7.20</PRICE>
    <YEAR>1985</YEAR>
  </CD>
  <CD>
    <TITLE>Red</TITLE>
    <ARTIST>The Communards</ARTIST>
    <COUNTRY>UK</COUNTRY>
    <COMPANY>London</COMPANY>
    <PRICE>7.80</PRICE>
    <YEAR>1987</YEAR>
  </CD>
  <CD>
    <TITLE>Unchain my heart</TITLE>
    <ARTIST>Joe Cocker</ARTIST>
    <COUNTRY>USA</COUNTRY>
    <COMPANY>EMI</COMPANY>
    <PRICE>8.20</PRICE>
    <YEAR>1987</YEAR>
  </CD>
</CATALOG>`
    },
    {
        id: "autos",
        label: "Vehicles",
        defaultXPath: "//marke[@name='BMW']/modell/name/text()",
        examples: [
            "//marke/@name",
            "//marke[@name='BMW']/modell/name/text()",
            "//modell[kraftstoff='Elektro']/name/text()",
            "//modell[leistung_ps > 500]/name/text()",
            "//marke[@name='Audi']/modell[name='RS6 Avant']/preis_eur/text()",
            "//marke[@name='Mercedes-Benz']/@land",
            "count(//modell)"
        ],
        xml: `<autos>
    <marke name="BMW" land="Deutschland">
        <modell>
            <name>330i</name>
            <baujahr>2023</baujahr>
            <leistung_ps>258</leistung_ps>
            <antrieb>Heckantrieb</antrieb>
            <kraftstoff>Benzin</kraftstoff>
            <preis_eur>52000</preis_eur>
        </modell>
        <modell>
            <name>M3 Competition</name>
            <baujahr>2024</baujahr>
            <leistung_ps>510</leistung_ps>
            <antrieb>Allrad</antrieb>
            <kraftstoff>Benzin</kraftstoff>
            <preis_eur>97000</preis_eur>
        </modell>
        <modell>
            <name>i4 M50</name>
            <baujahr>2024</baujahr>
            <leistung_ps>544</leistung_ps>
            <antrieb>Allrad</antrieb>
            <kraftstoff>Elektro</kraftstoff>
            <preis_eur>72000</preis_eur>
        </modell>
    </marke>
    <marke name="Audi" land="Deutschland">
        <modell>
            <name>A4 Avant</name>
            <baujahr>2023</baujahr>
            <leistung_ps>204</leistung_ps>
            <antrieb>Frontantrieb</antrieb>
            <kraftstoff>Diesel</kraftstoff>
            <preis_eur>48000</preis_eur>
        </modell>
        <modell>
            <name>RS6 Avant</name>
            <baujahr>2024</baujahr>
            <leistung_ps>630</leistung_ps>
            <antrieb>Quattro</antrieb>
            <kraftstoff>Benzin</kraftstoff>
            <preis_eur>135000</preis_eur>
        </modell>
        <modell>
            <name>Q8 e-tron</name>
            <baujahr>2024</baujahr>
            <leistung_ps>408</leistung_ps>
            <antrieb>Allrad</antrieb>
            <kraftstoff>Elektro</kraftstoff>
            <preis_eur>82000</preis_eur>
        </modell>
    </marke>
    <marke name="Mercedes-Benz" land="Deutschland">
        <modell>
            <name>C 300</name>
            <baujahr>2024</baujahr>
            <leistung_ps>258</leistung_ps>
            <antrieb>Heckantrieb</antrieb>
            <kraftstoff>Benzin</kraftstoff>
            <preis_eur>56000</preis_eur>
        </modell>
        <modell>
            <name>AMG E 63 S</name>
            <baujahr>2023</baujahr>
            <leistung_ps>612</leistung_ps>
            <antrieb>4MATIC+</antrieb>
            <kraftstoff>Benzin</kraftstoff>
            <preis_eur>128000</preis_eur>
        </modell>
        <modell>
            <name>EQE 350+</name>
            <baujahr>2024</baujahr>
            <leistung_ps>292</leistung_ps>
            <antrieb>Heckantrieb</antrieb>
            <kraftstoff>Elektro</kraftstoff>
            <preis_eur>74000</preis_eur>
        </modell>
    </marke>
</autos>`
    },
    {
        id: "powerplatform-solutions",
        label: "Power Platform Solutions",
        defaultXPath: "//solution[@publisher='Contoso']/components/component[@type='cloud-flow']/name/text()",
        examples: [
            "//solution/@name",
            "//solution[@managed='true']/@name",
            "//solution[@publisher='Contoso']/components/component[@type='cloud-flow']/name/text()",
            "//component[@type='canvas-app' and contains(ownerTeam, 'Sales')]/name/text()",
            "//component[dependencies/dependency[@type='environment-variable']]/name/text()",
            "//solution[components/component[@critical='true']]/@uniqueName",
            "//connectionReferences/connectionReference[@status='missing']/@logicalName",
            "//environmentVariables/environmentVariable[@secret='true']/schemaName/text()",
            "//component[starts-with(name, 'Case')]/@id",
            "count(//component)",
            "count(//component[@type='plugin-step'])",
            "sum(//solution/componentSummary/@count)"
        ],
        xml: `<powerPlatform exportDate="2026-05-27" environment="Prod-EU-01" tenant="contoso.onmicrosoft.com">
    <solutions>
        <solution id="sol-001" name="Core Sales" uniqueName="contoso_CoreSales" version="3.14.2.0" managed="true" publisher="Contoso">
            <description>Basiskomponenten fuer Vertrieb und Leadprozess.</description>
            <componentSummary count="9" />
            <components>
                <component id="cmp-001" type="table" critical="true">
                    <name>cr8d4_accountprofile</name>
                    <displayName>Account Profile</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Platform Core</ownerTeam>
                    <modifiedOn>2026-05-14</modifiedOn>
                    <dependencies>
                        <dependency type="choice" target="cr8d4_accounttier" />
                        <dependency type="environment-variable" target="cr8d4_BaseApiUrl" />
                    </dependencies>
                </component>
                <component id="cmp-002" type="model-driven-app" critical="true">
                    <name>Sales Hub Plus</name>
                    <displayName>Sales Hub Plus</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Sales Ops</ownerTeam>
                    <modifiedOn>2026-05-19</modifiedOn>
                    <dependencies>
                        <dependency type="table" target="cr8d4_accountprofile" />
                        <dependency type="dashboard" target="Sales Executive Dashboard" />
                    </dependencies>
                </component>
                <component id="cmp-003" type="cloud-flow" critical="true">
                    <name>Lead Assignment Flow</name>
                    <displayName>Lead Assignment Flow</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Sales Automation</ownerTeam>
                    <modifiedOn>2026-05-20</modifiedOn>
                    <dependencies>
                        <dependency type="connection-reference" target="cr8d4_sharedoffice365" />
                        <dependency type="environment-variable" target="cr8d4_LeadQueueMailbox" />
                    </dependencies>
                </component>
                <component id="cmp-004" type="business-rule" critical="false">
                    <name>Account Tier Validation</name>
                    <displayName>Account Tier Validation</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Platform Core</ownerTeam>
                    <modifiedOn>2026-05-03</modifiedOn>
                    <dependencies>
                        <dependency type="table" target="cr8d4_accountprofile" />
                    </dependencies>
                </component>
                <component id="cmp-005" type="dashboard" critical="false">
                    <name>Sales Executive Dashboard</name>
                    <displayName>Sales Executive Dashboard</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Sales Ops</ownerTeam>
                    <modifiedOn>2026-05-11</modifiedOn>
                    <dependencies>
                        <dependency type="chart" target="Pipeline by Region" />
                    </dependencies>
                </component>
                <component id="cmp-006" type="chart" critical="false">
                    <name>Pipeline by Region</name>
                    <displayName>Pipeline by Region</displayName>
                    <layer>managed</layer>
                    <ownerTeam>BI Team</ownerTeam>
                    <modifiedOn>2026-05-09</modifiedOn>
                    <dependencies />
                </component>
                <component id="cmp-007" type="security-role" critical="true">
                    <name>Sales Manager Extended</name>
                    <displayName>Sales Manager Extended</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Security</ownerTeam>
                    <modifiedOn>2026-05-17</modifiedOn>
                    <dependencies />
                </component>
                <component id="cmp-008" type="command-bar" critical="false">
                    <name>Lead Quick Actions</name>
                    <displayName>Lead Quick Actions</displayName>
                    <layer>managed</layer>
                    <ownerTeam>UX Team</ownerTeam>
                    <modifiedOn>2026-05-07</modifiedOn>
                    <dependencies>
                        <dependency type="javascript-webresource" target="cr8d4_salesRibbon.js" />
                    </dependencies>
                </component>
                <component id="cmp-009" type="javascript-webresource" critical="true">
                    <name>cr8d4_salesRibbon.js</name>
                    <displayName>Sales Ribbon Script</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Frontend Enablement</ownerTeam>
                    <modifiedOn>2026-05-21</modifiedOn>
                    <dependencies />
                </component>
            </components>
            <connectionReferences>
                <connectionReference logicalName="cr8d4_sharedoffice365" connector="shared_office365" status="active" />
                <connectionReference logicalName="cr8d4_sharedteams" connector="shared_teams" status="active" />
            </connectionReferences>
            <environmentVariables>
                <environmentVariable schemaName="cr8d4_BaseApiUrl" type="text" currentValue="https://internal-api.contoso.local" secret="false" />
                <environmentVariable schemaName="cr8d4_LeadQueueMailbox" type="text" currentValue="leadqueue@contoso.com" secret="false" />
                <environmentVariable schemaName="cr8d4_SigningSecret" type="secret" currentValue="***" secret="true" />
            </environmentVariables>
        </solution>
        <solution id="sol-002" name="Customer Service Accelerator" uniqueName="contoso_CaseMgmt" version="5.2.0.3" managed="false" publisher="Contoso">
            <description>Case Management, SLA-Automation und Agent-Workspace.</description>
            <componentSummary count="10" />
            <components>
                <component id="cmp-101" type="table" critical="true">
                    <name>cr8d4_caseheader</name>
                    <displayName>Case Header</displayName>
                    <layer>unmanaged</layer>
                    <ownerTeam>Service Platform</ownerTeam>
                    <modifiedOn>2026-05-25</modifiedOn>
                    <dependencies>
                        <dependency type="choice" target="cr8d4_casepriority" />
                    </dependencies>
                </component>
                <component id="cmp-102" type="canvas-app" critical="true">
                    <name>Case Console</name>
                    <displayName>Case Console</displayName>
                    <layer>unmanaged</layer>
                    <ownerTeam>Sales and Service</ownerTeam>
                    <modifiedOn>2026-05-24</modifiedOn>
                    <dependencies>
                        <dependency type="table" target="cr8d4_caseheader" />
                        <dependency type="custom-page" target="Case Snapshot" />
                    </dependencies>
                </component>
                <component id="cmp-103" type="custom-page" critical="false">
                    <name>Case Snapshot</name>
                    <displayName>Case Snapshot</displayName>
                    <layer>unmanaged</layer>
                    <ownerTeam>Frontend Enablement</ownerTeam>
                    <modifiedOn>2026-05-20</modifiedOn>
                    <dependencies />
                </component>
                <component id="cmp-104" type="cloud-flow" critical="true">
                    <name>Case Escalation Flow</name>
                    <displayName>Case Escalation Flow</displayName>
                    <layer>unmanaged</layer>
                    <ownerTeam>Service Automation</ownerTeam>
                    <modifiedOn>2026-05-26</modifiedOn>
                    <dependencies>
                        <dependency type="connection-reference" target="cr8d4_sharedservicenow" />
                        <dependency type="environment-variable" target="cr8d4_EscalationWebhook" />
                    </dependencies>
                </component>
                <component id="cmp-105" type="plugin-assembly" critical="true">
                    <name>Contoso.Case.Plugins</name>
                    <displayName>Contoso.Case.Plugins</displayName>
                    <layer>unmanaged</layer>
                    <ownerTeam>Backend Extensibility</ownerTeam>
                    <modifiedOn>2026-05-23</modifiedOn>
                    <dependencies />
                </component>
                <component id="cmp-106" type="plugin-step" critical="true">
                    <name>CaseCreatePreValidation</name>
                    <displayName>CaseCreatePreValidation</displayName>
                    <layer>unmanaged</layer>
                    <ownerTeam>Backend Extensibility</ownerTeam>
                    <modifiedOn>2026-05-23</modifiedOn>
                    <dependencies>
                        <dependency type="plugin-assembly" target="Contoso.Case.Plugins" />
                    </dependencies>
                </component>
                <component id="cmp-107" type="plugin-step" critical="true">
                    <name>CaseClosePostOperation</name>
                    <displayName>CaseClosePostOperation</displayName>
                    <layer>unmanaged</layer>
                    <ownerTeam>Backend Extensibility</ownerTeam>
                    <modifiedOn>2026-05-23</modifiedOn>
                    <dependencies>
                        <dependency type="plugin-assembly" target="Contoso.Case.Plugins" />
                    </dependencies>
                </component>
                <component id="cmp-108" type="sla" critical="false">
                    <name>Premium Case SLA</name>
                    <displayName>Premium Case SLA</displayName>
                    <layer>unmanaged</layer>
                    <ownerTeam>Service Governance</ownerTeam>
                    <modifiedOn>2026-05-18</modifiedOn>
                    <dependencies>
                        <dependency type="table" target="cr8d4_caseheader" />
                    </dependencies>
                </component>
                <component id="cmp-109" type="queue" critical="false">
                    <name>Case Escalation Queue</name>
                    <displayName>Case Escalation Queue</displayName>
                    <layer>unmanaged</layer>
                    <ownerTeam>Service Ops</ownerTeam>
                    <modifiedOn>2026-05-16</modifiedOn>
                    <dependencies />
                </component>
                <component id="cmp-110" type="business-process-flow" critical="false">
                    <name>Case Lifecycle</name>
                    <displayName>Case Lifecycle</displayName>
                    <layer>unmanaged</layer>
                    <ownerTeam>Service Platform</ownerTeam>
                    <modifiedOn>2026-05-15</modifiedOn>
                    <dependencies>
                        <dependency type="table" target="cr8d4_caseheader" />
                    </dependencies>
                </component>
            </components>
            <connectionReferences>
                <connectionReference logicalName="cr8d4_sharedservicenow" connector="shared_servicenow" status="missing" />
                <connectionReference logicalName="cr8d4_sharedoutlook" connector="shared_office365users" status="active" />
            </connectionReferences>
            <environmentVariables>
                <environmentVariable schemaName="cr8d4_EscalationWebhook" type="text" currentValue="https://hooks.contoso.local/escalation" secret="false" />
                <environmentVariable schemaName="cr8d4_AgentDesktopProfile" type="text" currentValue="Tier2Agent" secret="false" />
            </environmentVariables>
        </solution>
        <solution id="sol-003" name="Field Service Extensions" uniqueName="contoso_FieldOps" version="2.8.1.1" managed="true" publisher="Fabrikam">
            <description>Erweiterungen fuer Einsatzplanung, mobile App und IoT-Meldungen.</description>
            <componentSummary count="8" />
            <components>
                <component id="cmp-201" type="table" critical="true">
                    <name>fxm_workorderextension</name>
                    <displayName>Work Order Extension</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Field Platform</ownerTeam>
                    <modifiedOn>2026-04-29</modifiedOn>
                    <dependencies />
                </component>
                <component id="cmp-202" type="cloud-flow" critical="true">
                    <name>IoT Alert Dispatch</name>
                    <displayName>IoT Alert Dispatch</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Field Automation</ownerTeam>
                    <modifiedOn>2026-05-02</modifiedOn>
                    <dependencies>
                        <dependency type="connection-reference" target="fxm_sharedazureiot" />
                        <dependency type="environment-variable" target="fxm_IoTRouteName" />
                    </dependencies>
                </component>
                <component id="cmp-203" type="canvas-app" critical="false">
                    <name>Technician Assist</name>
                    <displayName>Technician Assist</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Field Mobility</ownerTeam>
                    <modifiedOn>2026-05-05</modifiedOn>
                    <dependencies>
                        <dependency type="table" target="fxm_workorderextension" />
                    </dependencies>
                </component>
                <component id="cmp-204" type="site-map" critical="false">
                    <name>Field Service Navigation</name>
                    <displayName>Field Service Navigation</displayName>
                    <layer>managed</layer>
                    <ownerTeam>UX Team</ownerTeam>
                    <modifiedOn>2026-04-22</modifiedOn>
                    <dependencies />
                </component>
                <component id="cmp-205" type="security-role" critical="true">
                    <name>Field Dispatcher</name>
                    <displayName>Field Dispatcher</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Security</ownerTeam>
                    <modifiedOn>2026-04-30</modifiedOn>
                    <dependencies />
                </component>
                <component id="cmp-206" type="modern-commanding" critical="false">
                    <name>Work Order Commands</name>
                    <displayName>Work Order Commands</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Field Mobility</ownerTeam>
                    <modifiedOn>2026-05-08</modifiedOn>
                    <dependencies />
                </component>
                <component id="cmp-207" type="view" critical="false">
                    <name>Open Work Orders by Region</name>
                    <displayName>Open Work Orders by Region</displayName>
                    <layer>managed</layer>
                    <ownerTeam>Field Platform</ownerTeam>
                    <modifiedOn>2026-05-01</modifiedOn>
                    <dependencies>
                        <dependency type="table" target="fxm_workorderextension" />
                    </dependencies>
                </component>
                <component id="cmp-208" type="chart" critical="false">
                    <name>First Time Fix Rate</name>
                    <displayName>First Time Fix Rate</displayName>
                    <layer>managed</layer>
                    <ownerTeam>BI Team</ownerTeam>
                    <modifiedOn>2026-04-28</modifiedOn>
                    <dependencies />
                </component>
            </components>
            <connectionReferences>
                <connectionReference logicalName="fxm_sharedazureiot" connector="shared_azureiotcentral" status="active" />
                <connectionReference logicalName="fxm_shareddataverse" connector="shared_commondataserviceforapps" status="active" />
            </connectionReferences>
            <environmentVariables>
                <environmentVariable schemaName="fxm_IoTRouteName" type="text" currentValue="field-alert-route" secret="false" />
                <environmentVariable schemaName="fxm_MobileTheme" type="text" currentValue="FieldDark" secret="false" />
            </environmentVariables>
        </solution>
    </solutions>
</powerPlatform>`
    },
    {
        id: "mitarbeitende",
        label: "Employees",
        defaultXPath: "//person[@rolle='Security']/name/text()",
        examples: [
            "//person/name/text()",
            "//person[@rolle='Security']/name/text()",
            "//person[standort='Wien']/@id",
            "//projekt[contains(technologien, 'XPath')]/name/text()",
            "count(//person[remote='true'])"
        ],
        xml: `<unternehmen>
    <abteilung name="Platform">
        <person id="p-100" rolle="Lead">
            <name>Alex Winter</name>
            <standort>Wien</standort>
            <remote>false</remote>
        </person>
        <person id="p-101" rolle="Security">
            <name>Samira Roth</name>
            <standort>Berlin</standort>
            <remote>true</remote>
        </person>
    </abteilung>
    <abteilung name="Automation">
        <person id="p-200" rolle="Engineer">
            <name>Deniz Kara</name>
            <standort>Wien</standort>
            <remote>true</remote>
        </person>
        <projekt>
            <name>XPath Shield</name>
            <technologien>XPath, XML, Offline UI</technologien>
        </projekt>
    </abteilung>
</unternehmen>`
    },
    {
        id: "bestellungen",
        label: "Orders",
        defaultXPath: "//bestellung[position()=1]/kunde/name/text()",
        examples: [
            "//bestellung/@nummer",
            "//bestellung[sum(positionen/position/menge) > 5]/@nummer",
            "//kunde[land='AT']/name/text()",
            "//position[preis_netto > 100]/artikel/text()",
            "count(//bestellung[positionen/position])"
        ],
        xml: `<bestellungen>
    <bestellung nummer="A-1000" status="offen">
        <kunde>
            <name>Nordstern GmbH</name>
            <land>AT</land>
        </kunde>
        <positionen>
            <position>
                <artikel>XML Gateway</artikel>
                <menge>2</menge>
                <preis_netto>129.90</preis_netto>
            </position>
            <position>
                <artikel>XPath Audit</artikel>
                <menge>5</menge>
                <preis_netto>89.00</preis_netto>
            </position>
        </positionen>
    </bestellung>
    <bestellung nummer="B-2040" status="versendet">
        <kunde>
            <name>Helix AG</name>
            <land>DE</land>
        </kunde>
        <positionen>
            <position>
                <artikel>Offline Scanner</artikel>
                <menge>1</menge>
                <preis_netto>299.00</preis_netto>
            </position>
        </positionen>
    </bestellung>
</bestellungen>`
    }
];
