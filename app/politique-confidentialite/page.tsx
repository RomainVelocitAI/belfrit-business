import React from 'react';

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 belgium-bars pb-3 inline-block">
          Politique de confidentialité
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              BelFrit Business accorde une grande importance à la protection de vos données personnelles. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons, stockons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
            </p>
          </section>

          {/* Responsable du traitement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsable du traitement des données</h2>
            <p className="text-gray-700 leading-relaxed">
              Le responsable du traitement des données personnelles est :<br />
              <strong>BelFrit Business</strong><br />
              Directeur de publication : Angelo Rapazzini<br />
              Email : <a href="mailto:info@belfritbusiness.fr" className="text-[#E31E24] hover:underline">info@belfritbusiness.fr</a><br />
              Téléphone : <a href="tel:+262693659589" className="text-[#E31E24] hover:underline">+262 693 659 589</a>
            </p>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Données personnelles collectées</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous collectons les données suivantes lors de votre utilisation de notre site :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Données d'identification</strong> : nom, prénom, raison sociale</li>
              <li><strong>Coordonnées</strong> : adresse email, numéro de téléphone, adresse postale</li>
              <li><strong>Données professionnelles</strong> : numéro SIRET, secteur d'activité, fonction</li>
              <li><strong>Données de commande</strong> : historique d'achats, préférences produits</li>
              <li><strong>Données de navigation</strong> : adresse IP, cookies, pages visitées</li>
              <li><strong>Documents administratifs</strong> : KBIS, justificatifs professionnels</li>
            </ul>
          </section>

          {/* Finalités du traitement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Finalités du traitement</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vos données personnelles sont collectées pour les finalités suivantes :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Gestion de votre compte professionnel</li>
              <li>Traitement et suivi de vos commandes</li>
              <li>Facturation et gestion comptable</li>
              <li>Communication commerciale et marketing (avec votre consentement)</li>
              <li>Amélioration de nos services et du site web</li>
              <li>Respect de nos obligations légales et réglementaires</li>
              <li>Prévention de la fraude</li>
            </ul>
          </section>

          {/* Base légale */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Base légale du traitement</h2>
            <p className="text-gray-700 leading-relaxed">
              Le traitement de vos données personnelles repose sur :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
              <li><strong>L'exécution du contrat</strong> : pour gérer votre compte et vos commandes</li>
              <li><strong>Votre consentement</strong> : pour les communications marketing</li>
              <li><strong>L'intérêt légitime</strong> : pour améliorer nos services</li>
              <li><strong>Les obligations légales</strong> : pour la facturation et la comptabilité</li>
            </ul>
          </section>

          {/* Destinataires */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Destinataires des données</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vos données personnelles sont destinées à :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Notre équipe interne (service commercial, logistique, comptabilité)</li>
              <li>Nos prestataires techniques (hébergement, paiement en ligne)</li>
              <li>Nos transporteurs pour la livraison</li>
              <li>Les autorités compétentes sur réquisition judiciaire</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Nous nous assurons que tous nos partenaires respectent des niveaux de sécurité et de confidentialité équivalents aux nôtres.
            </p>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Durée de conservation</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vos données sont conservées pendant les durées suivantes :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Données de compte actif</strong> : pendant toute la durée de la relation commerciale + 3 ans</li>
              <li><strong>Données de facturation</strong> : 10 ans (obligation légale)</li>
              <li><strong>Données de prospection</strong> : 3 ans à compter du dernier contact</li>
              <li><strong>Cookies</strong> : 13 mois maximum</li>
            </ul>
          </section>

          {/* Droits */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vos droits</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement</strong> : supprimer vos données (sous conditions)</li>
              <li><strong>Droit d'opposition</strong> : refuser le traitement de vos données</li>
              <li><strong>Droit à la limitation</strong> : limiter le traitement de vos données</li>
              <li><strong>Droit à la portabilité</strong> : récupérer vos données dans un format structuré</li>
              <li><strong>Droit de retirer votre consentement</strong> : à tout moment</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Pour exercer vos droits, contactez-nous à : <a href="mailto:info@belfritbusiness.fr" className="text-[#E31E24] hover:underline font-semibold">info@belfritbusiness.fr</a>
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#E31E24] hover:underline">www.cnil.fr</a>).
            </p>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sécurité des données</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour garantir la sécurité de vos données personnelles :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
              <li>Chiffrement SSL/TLS des données en transit</li>
              <li>Hébergement sécurisé chez des prestataires certifiés</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Surveillance et audit réguliers de nos systèmes</li>
              <li>Procédures de sauvegarde et de récupération</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies et traceurs</h2>
            <p className="text-gray-700 leading-relaxed">
              Notre site utilise des cookies pour améliorer votre expérience de navigation et réaliser des statistiques de visite. Vous pouvez à tout moment configurer vos préférences de cookies dans les paramètres de votre navigateur.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Types de cookies utilisés :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
              <li><strong>Cookies essentiels</strong> : nécessaires au fonctionnement du site</li>
              <li><strong>Cookies analytiques</strong> : pour mesurer l'audience et améliorer le site</li>
              <li><strong>Cookies de personnalisation</strong> : pour mémoriser vos préférences</li>
            </ul>
          </section>

          {/* Transfert international */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Transferts internationaux</h2>
            <p className="text-gray-700 leading-relaxed">
              Certains de nos prestataires (notamment l'hébergeur Vercel) peuvent être situés en dehors de l'Union Européenne. Dans ce cas, nous nous assurons que des garanties appropriées sont mises en place conformément au RGPD (clauses contractuelles types, mécanismes de certification).
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications de la politique</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. La version mise à jour sera publiée sur cette page avec la date de dernière modification. Nous vous encourageons à consulter régulièrement cette page.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#E31E24]">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nous contacter</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits :<br />
              Email : <a href="mailto:info@belfritbusiness.fr" className="text-[#E31E24] hover:underline font-semibold">info@belfritbusiness.fr</a><br />
              Téléphone : <a href="tel:+262693659589" className="text-[#E31E24] hover:underline font-semibold">+262 693 659 589</a><br />
              Adresse : BelFrit Business, La Réunion, France
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-12">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </main>
  );
}
