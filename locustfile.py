## pip install locust
## locust --host=https://csbi.chalmers.se

import time
from locust import HttpUser, task, between

class RandomUser(HttpUser):
    wait_time = between(1, 10)

    @task(1)
    def integrated_models(self):
        self.client.get("/api/v2/repository/integrated_models/")

    @task(2)
    def random_components(self):
        self.client.get("/api/v2/random-components?model=HumanGem&version=1_3_0")

    @task(3)
    def reactions(self):
        self.client.get("/api/v2/reactions/MAR01166?version=1_3_0")
        self.client.get("/api/v2/reactions/MAR01166/related-reactions?version=1_3_0")

    @task(4)
    def subsystems(self):
        self.client.get("/api/v2/subsystems/transport_reactions?version=1_3_0")
        self.client.get("/api/v2/subsystems/transport_reactions/related-reactions?limit=20&version=1_3_0")


    @task(5)
    def metabolites(self):
        self.client.get("/api/v2/metabolites/MAM01199m?version=1_3_0")
        self.client.get("/api/v2/metabolites/MAM01199m/related-metabolites?version=1_3_0")

    @task(6)
    def viewer(self):
        self.client.get("/api/v2/maps/listing?model=HumanGem&version=1_3_0")
        self.client.get("/api/v2/data-overlay/Human-GEM/")
        self.client.get("/api/v2/svg/Human-GEM/cytosol_1.svg")

    def on_start(self):
        self.client.get("/")
